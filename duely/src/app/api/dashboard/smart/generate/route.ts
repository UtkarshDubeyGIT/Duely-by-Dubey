import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClients, getInvoices } from "@/lib/data";
import { buildSystemPrompt, buildUserMessage } from "@/lib/generative/prompt";
import { validateAndFix } from "@/lib/generative/validate";
import {
  checkRateLimit,
  getCachedSpec,
  setCachedSpec,
  invalidateCache,
} from "@/lib/generative/rate-limit";

export const runtime = "nodejs";

const systemPrompt = buildSystemPrompt();
const GEMINI_MODEL = "gemini-2.5-flash";

function writeStream(controller: ReadableStreamDefaultController, spec: unknown): void {
  const obj = spec as Record<string, unknown>;
  const elements = obj.elements as Record<string, Record<string, unknown>> | undefined;
  if (!elements) {
    controller.enqueue(new TextEncoder().encode(JSON.stringify(spec) + "\n"));
    return;
  }
  const root = obj.root as string;
  const keys = Object.keys(elements);
  controller.enqueue(
    new TextEncoder().encode(
      JSON.stringify({ root, elements: { [root]: elements[root] } }) + "\n"
    )
  );
  for (const key of keys) {
    if (key === root) continue;
    controller.enqueue(
      new TextEncoder().encode(
        JSON.stringify({ elements: { [key]: elements[key] } }) + "\n"
      )
    );
  }
}

function normalizeSpec(s: unknown): Record<string, unknown> {
  const obj = s as Record<string, unknown>;
  const elements = obj.elements as Record<string, Record<string, unknown>> | undefined;
  if (!elements) return obj;
  for (const [key, el] of Object.entries(elements)) {
    if (!el.props) {
      const { type, children, visible, ...rest } = el;
      const normalized: Record<string, unknown> = { type, props: rest, children: children ?? [] };
      if (visible != null) normalized.visible = visible;
      elements[key] = normalized;
    }
    if (!el.children) el.children = [];
  }
  return obj;
}

function tryParseObject(text: string): unknown | null {
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  cleaned = cleaned.replace(/^\uFEFF/, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  const strategies = [
    () => JSON.parse(cleaned),
    () => JSON.parse(cleaned.replace(/'/g, '"')),
    () => JSON.parse(cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]")),
    () => JSON.parse(cleaned.replace(/\n/g, " ").trim()),
  ];
  for (const fn of strategies) {
    try { return fn(); } catch { continue; }
  }
  return null;
}

function tryParseJSONL(text: string): Record<string, unknown> | null {
  const lines = text.split(/\r?\n/);
  const result: Record<string, unknown> = { elements: {} };
  const elementPatches: Record<string, unknown>[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const patch = JSON.parse(trimmed) as Record<string, unknown>;
      if (patch.path === "/root") result.root = patch.value;
      else if (typeof patch.path === "string" && patch.path.startsWith("/elements/"))
        elementPatches.push(patch);
      else if (patch.root && patch.elements) return patch;
    } catch { continue; }
  }

  for (const patch of elementPatches) {
    const path = String(patch.path ?? "");
    if (path.startsWith("/elements/") && patch.value && typeof patch.value === "object") {
      const key = path.replace("/elements/", "");
      (result.elements as Record<string, unknown>)[key] = patch.value;
    }
  }

  if (result.root && Object.keys(result.elements as Record<string, unknown>).length > 0)
    return result;
  return null;
}

async function callGemini(apiKey: string, userMessage: string) {
  return fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 8192,
      response_format: { type: "json_object" },
      temperature: 0.3,
    }),
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "" || apiKey === "your_actual_gemini_key_here") {
    return NextResponse.json({ error: "AI insights not available — API key not configured" }, { status: 401 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ reason: "no_data" }, { status: 200 });
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.org_id) return NextResponse.json({ reason: "no_data" }, { status: 200 });

    // rate limit — graceful error, not a crash
    const rateResult = checkRateLimit(profile.org_id);
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: `AI insights not available — rate limit reached. Try again in ${rateResult.retryAfterMinutes} minute(s).` },
        { status: 429 }
      );
    }

    let body: { prompt?: string | null; currentSpec?: unknown } = {};
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { prompt, currentSpec } = body;

    // check if there's data
    const invoices = await getInvoices();
    if (!invoices || invoices.length === 0) {
      return NextResponse.json({ reason: "no_data" }, { status: 200 });
    }

    // check cache for initial spec
    if (!prompt && !currentSpec) {
      const cached = getCachedSpec(profile.org_id);
      if (cached) {
        const stream = new ReadableStream({
          start(controller) { writeStream(controller, cached); controller.close(); },
        });
        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
        });
      }
    }

    // build user message (no state data — AI only needs paths)
    const userMessage = buildUserMessage({ prompt, currentSpec });

    // call Gemini
    const geminiResponse = await callGemini(apiKey, userMessage);

    if (!geminiResponse.ok) {
      if (geminiResponse.status === 401 || geminiResponse.status === 403) {
        return NextResponse.json({ error: "AI insights not available — API key invalid" }, { status: 401 });
      }
      if (geminiResponse.status === 429) {
        return NextResponse.json({ error: "AI insights not available — Gemini rate limit reached. Try again shortly." }, { status: 429 });
      }
      console.error("Gemini API error:", geminiResponse.status, await geminiResponse.text().catch(() => ""));
      return NextResponse.json({ error: "AI insights not available — service error" }, { status: 502 });
    }

    const responseData = await geminiResponse.json();
    const rawText =
      responseData.choices?.[0]?.message?.content ??
      responseData.candidates?.[0]?.content?.parts?.[0]?.text ??
      "";

    if (!rawText || rawText.trim() === "") {
      return NextResponse.json({ error: "AI insights not available — empty response from AI" }, { status: 502 });
    }

    let spec: unknown = tryParseObject(rawText) ?? tryParseJSONL(rawText);

    if (spec == null) {
      console.error("Failed to parse Gemini JSON. Raw (first 500):", rawText.slice(0, 500));
      return NextResponse.json({ error: "AI insights not available — invalid response format" }, { status: 502 });
    }

    // normalize + validate
    spec = normalizeSpec(spec);
    const validation = validateAndFix(spec);

    if (!validation.valid) {
      // one repair retry
      const retryUserMessage = buildUserMessage({
        prompt: `Fix these spec issues:\n${validation.issues.join("\n")}`,
      });
      const retryResponse = await callGemini(apiKey, retryUserMessage);

      if (retryResponse.ok) {
        const retryData = await retryResponse.json();
        const retryText = retryData.choices?.[0]?.message?.content ?? "";
        const retrySpec = tryParseObject(retryText) ?? tryParseJSONL(retryText);
        if (retrySpec) {
          spec = normalizeSpec(retrySpec);
          const retryValidation = validateAndFix(spec);
          if (retryValidation.valid) spec = retryValidation.spec;
          else spec = validation.spec;
        } else {
          spec = validation.spec;
        }
      } else {
        spec = validation.spec;
      }
    } else {
      spec = validation.spec;
    }

    // cache initial spec
    if (!prompt && !currentSpec) setCachedSpec(profile.org_id, spec);
    else if (prompt && currentSpec) invalidateCache(profile.org_id);

    // stream spec progressively
    const stream = new ReadableStream({
      start(controller) { writeStream(controller, spec); controller.close(); },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });
  } catch (error) {
    console.error("Smart dashboard error:", error);
    return NextResponse.json(
      { error: "AI insights not available — " + (error instanceof Error ? error.message : "unknown error") },
      { status: 500 }
    );
  }
}
