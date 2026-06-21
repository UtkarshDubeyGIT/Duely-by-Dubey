import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeBusinessData } from "@/lib/dashboard-aggregations";

export const runtime = "nodejs";

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "" || apiKey === "your_actual_gemini_key_here") {
    return NextResponse.json({
      insight: null,
      insights: null,
      reason: "no_key",
    });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({
      insight: null,
      insights: null,
      reason: "no_data",
    });
  }

  try {
    const { data: invoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*, client:clients(*)");

    if (invoicesError || !invoices || invoices.length === 0) {
      return NextResponse.json({
        insight: null,
        insights: null,
        reason: "no_data",
      });
    }

    const { data: clients } = await supabase.from("clients").select("*");

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString();
    const { data: reminderLogs } = await supabase
      .from("reminder_logs")
      .select("*")
      .gte("sent_at", startOfMonth);

    const businessData = computeBusinessData(invoices, clients, reminderLogs);

    const systemPrompt = `You are a concise financial advisor for small businesses.
Analyze the business data and return ONLY a valid JSON array of 
exactly 3 strings. Each string is one actionable insight, 1-2 
sentences max. No markdown, no explanation, no keys — just a raw 
JSON array like: ["insight one", "insight two", "insight three"]`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(businessData) },
          ],
          response_format: { type: "json_object" },
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          insight: null,
          insights: null,
          reason: "no_key",
        });
      }
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const responseData = await response.json();
    const rawText =
      responseData.choices?.[0]?.message?.content ??
      responseData.candidates?.[0]?.content?.parts?.[0]?.text ??
      "";

    let insights: string[] = [];

    try {
      const cleaned = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed)) {
        insights = parsed.slice(0, 3);
      } else if (parsed.insights && Array.isArray(parsed.insights)) {
        insights = parsed.insights.slice(0, 3);
      } else if (parsed.actions && Array.isArray(parsed.actions)) {
        insights = parsed.actions.slice(0, 3);
      } else {
        const firstArray = Object.values(parsed).find((v) =>
          Array.isArray(v)
        );
        if (firstArray)
          insights = (firstArray as string[]).slice(0, 3);
      }
    } catch {
      insights = rawText
        .split(/\n+/)
        .map((s: string) =>
          s.replace(/^[\d.\-*[\]]"\s*/, "").trim()
        )
        .filter((s: string) => s.length > 20)
        .slice(0, 3);
    }

    if (insights.length === 0) {
      insights = [rawText.slice(0, 200)];
    }

    while (insights.length < 3) {
      insights.push(insights[insights.length - 1]);
    }

    return NextResponse.json({
      insights,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      {
        insights: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load insights",
      },
      { status: 500 }
    );
  }
}
