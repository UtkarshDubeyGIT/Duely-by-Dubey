"use client";

import { useState, useCallback, useRef, useEffect, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { JSONUIProvider, Renderer } from "@json-render/react";
import {
  createStateStore,
  type Spec,
  type StateModel,
  type ComputedFunction,
} from "@json-render/core";
import { createRegistry } from "@/lib/generative/registry";
import { validateAndFix } from "@/lib/generative/validate";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Sparkles, RotateCw, Undo2, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GenerativeDashboardProps {
  initialState: StateModel;
}

const MAX_REPAIR_RETRIES = 1;

const computedFunctions: Record<string, ComputedFunction> = {
  filterInvoices: (args: Record<string, unknown>) => {
    const items = (args.items as Record<string, unknown>[]) ?? [];
    const status = args.status as string;
    if (!status || status === "all") return items;
    return items.filter(
      (item) => String(item.status ?? "").toLowerCase() === status.toLowerCase()
    );
  },
  formatCurrencyValue: (args: Record<string, unknown>) => {
    const value = Number(args.value ?? 0);
    const currency = (args.currency as string) ?? "USD";
    return formatCurrency(value, currency);
  },
  formatDateValue: (args: Record<string, unknown>) => {
    const date = args.date as string | null | undefined;
    return formatDate(date);
  },
  sumByField: (args: Record<string, unknown>) => {
    const items = (args.items as Record<string, unknown>[]) ?? [];
    const field = args.field as string;
    return items.reduce((sum, item) => {
      const val = Number(item[field] ?? 0);
      return sum + (Number.isNaN(val) ? 0 : val);
    }, 0);
  },
  countBy: (args: Record<string, unknown>) => {
    const items = (args.items as Record<string, unknown>[]) ?? [];
    const field = args.field as string;
    const value = args.value as string;
    if (!field || value == null) return items.length;
    return items.filter(
      (item) => String(item[field] ?? "").toLowerCase() === value.toLowerCase()
    ).length;
  },
};

export function GenerativeDashboard({ initialState }: GenerativeDashboardProps) {
  const router = useRouter();
  const store = useMemo(
    () => createStateStore(initialState as Record<string, unknown>),
    [initialState]
  );
  const [spec, setSpec] = useState<Spec | null>(null);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<"no_data" | "no_key" | "busy" | null>(null);
  const [refinementText, setRefinementText] = useState("");
  const [previousSpec, setPreviousSpec] = useState<Spec | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { registry } = useMemo(() => createRegistry(), []);

  const streamSpecRef = useRef<
    (prompt: string | null, existingSpec: Spec | null, attempt?: number) => Promise<void>
  >(async () => {});

  const streamSpec = useCallback(
    async (
      prompt: string | null,
      existingSpec: Spec | null,
      attempt: number = 0
    ) => {
      store.update({});
      const state = store.getSnapshot();

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setStreaming(true);
      setError(null);
      setReason(null);

      try {
        const res = await fetch("/api/dashboard/smart/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state,
            prompt,
            currentSpec: existingSpec,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 401 || res.status === 403) {
            setReason("no_key");
          } else if (res.status === 429) {
            setReason("busy");
            setError(errData.error ?? "Too many requests. Try again shortly.");
          } else {
            setError(errData.error ?? `Server error (${res.status})`);
          }
          setStreaming(false);
          setLoading(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setError("No response stream received");
          setStreaming(false);
          setLoading(false);
          return;
        }

        let buffer = "";
        const decoder = new TextDecoder();
        let accumulated: Record<string, unknown> = {};

        function normalizeElement(el: Record<string, unknown>): Record<string, unknown> {
          if (!el.props) {
            const { type, children, visible, ...rest } = el;
            const normalized: Record<string, unknown> = { type, props: rest, children: children ?? [] };
            if (visible != null) normalized.visible = visible;
            return normalized;
          }
          if (!el.children) el.children = [];
          return el;
        }

        function mergeLine(parsed: Record<string, unknown>) {
          if (parsed.root) accumulated.root = parsed.root;
          if (parsed.elements && typeof parsed.elements === "object") {
            const elems = parsed.elements as Record<string, Record<string, unknown>>;
            const existing = (accumulated.elements as Record<string, Record<string, unknown>>) ?? {};
            for (const [key, el] of Object.entries(elems)) {
              existing[key] = normalizeElement(el);
            }
            accumulated.elements = existing;
          }
          if (parsed.op === "add" && typeof parsed.path === "string") {
            if (parsed.path === "/root") {
              accumulated.root = parsed.value;
            } else if (parsed.path.startsWith("/elements/")) {
              const key = parsed.path.replace("/elements/", "");
              if (!accumulated.elements) accumulated.elements = {};
              (accumulated.elements as Record<string, unknown>)[key] = normalizeElement(parsed.value as Record<string, unknown>);
            }
          }
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const parsed = JSON.parse(trimmed);
              if (parsed.error) {
                setError(parsed.error);
                setStreaming(false);
                setLoading(false);
                return;
              }
              mergeLine(parsed);
              setSpec({ ...accumulated } as unknown as Spec);
            } catch {
              // skip non-JSON lines
            }
          }
        }

        if (buffer.trim()) {
          try {
            mergeLine(JSON.parse(buffer.trim()));
            setSpec({ ...accumulated } as unknown as Spec);
          } catch {
            // skip
          }
        }

        const finalSpec = accumulated as unknown as Spec;

        if (finalSpec) {
          const validation = validateAndFix(finalSpec);
          if (!validation.valid && attempt < MAX_REPAIR_RETRIES) {
            setStreaming(false);
            await streamSpecRef.current(
              `Your previous spec had these validation issues:\n${validation.issues.join("\n")}\nPlease fix them and regenerate.`,
              finalSpec,
              attempt + 1
            );
            return;
          }
          if (!validation.valid) {
            console.warn("Spec validation failed:", validation.issues);
            setError(`Generated dashboard has issues: ${validation.issues.join(", ")}`);
          } else {
            console.log("Valid spec set with root:", (validation.spec as unknown as Record<string, unknown>).root);
            console.log("Elements count:", Object.keys((validation.spec as unknown as Record<string, unknown>).elements as Record<string, unknown> ?? {}).length);
            setSpec(validation.spec);
          }
        }

        setStreaming(false);
        setLoading(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Stream error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to generate dashboard"
        );
        setStreaming(false);
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    streamSpecRef.current = streamSpec;
  });

  useEffect(() => {
    streamSpecRef.current(null, null);
  }, []);

  const handleRefine = useCallback(() => {
    if (!refinementText.trim() || streaming) return;
    setPreviousSpec(spec);
    setLoading(true);
    streamSpecRef.current(refinementText.trim(), spec);
    setRefinementText("");
  }, [refinementText, streaming, spec]);

  const handleUndo = useCallback(() => {
    if (previousSpec) {
      setSpec(previousSpec);
      setPreviousSpec(null);
    }
  }, [previousSpec]);

  const handleReset = useCallback(() => {
    if (streaming) return;
    setPreviousSpec(null);
    setLoading(true);
    setSpec(null);
    streamSpecRef.current(null, null);
  }, [streaming]);

  if (reason === "no_key" && process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <JSONUIProvider
      registry={registry}
      store={store}
      handlers={{
        openInvoice: (params: Record<string, unknown>) => {
          const invoiceId = params.invoiceId as string;
          if (invoiceId) {
            window.dispatchEvent(
              new CustomEvent("openInvoice", { detail: { invoiceId } })
            );
          }
        },
        navigate: (params: Record<string, unknown>) => {
          const route = params.route as string;
          if (route) router.push(route);
        },
      }}
      navigate={(route: string) => router.push(route)}
      functions={computedFunctions}
    >
      <div className="space-y-4">
        {/* Refinement Bar */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 -mx-4 px-4 py-3 flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={refinementText}
              onChange={(e) => setRefinementText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && refinementText.trim()) {
                  handleRefine();
                }
              }}
              placeholder="Refine the dashboard… (e.g. 'focus on overdue', 'show by client')"
              disabled={loading || streaming}
              className="h-9 text-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            />
            <Button
              size="sm"
              onClick={handleRefine}
              disabled={!refinementText.trim() || loading || streaming}
              className="h-9 shrink-0"
            >
              {streaming ? (
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
            {previousSpec && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleUndo}
                title="Undo last refinement"
                className="h-9 shrink-0"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleReset}
              disabled={loading || streaming}
              title="Reset to default dashboard"
              className="h-9 shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading && !spec && (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 h-28"
                  >
                    <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded mb-3" />
                    <div className="h-6 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
                  </div>
                ))}
              </div>
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-64" />
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-64" />
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-48" />
              <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                {streaming
                  ? "Assembling your dashboard…"
                  : "Analyzing your business data…"}
              </p>
            </div>
          )}

          {error && !spec && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-6 border border-red-100 dark:border-red-950/40 text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                {error}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                >
                  Open Classic Dashboard
                </Button>
              </div>
            </div>
          )}

          {reason === "no_key" && (
            <div className="rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-6 border border-zinc-200/50 dark:border-zinc-800/50 text-center">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                AI dashboard unavailable — GEMINI_API_KEY not configured.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/dashboard")}
              >
                Open Classic Dashboard
              </Button>
            </div>
          )}

          {reason === "no_data" && (
            <div className="rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-6 border border-zinc-200/50 dark:border-zinc-800/50 text-center">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Add your first invoice to unlock the Smart Dashboard.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/invoices")}
              >
                Go to Invoices
              </Button>
            </div>
          )}

          {reason === "busy" && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 p-6 border border-amber-100 dark:border-amber-950/40 text-center">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {error ?? "AI dashboard is busy — try again in a minute."}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => router.push("/dashboard")}
              >
                Open Classic Dashboard
              </Button>
            </div>
          )}

          {spec && Boolean((spec as unknown as Record<string, unknown>).root) && Boolean((spec as unknown as Record<string, unknown>).elements) && (
            <div className="relative">
              {streaming && (
                <div className="absolute -top-2 right-0 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  Updating…
                </div>
              )}
              <Renderer spec={spec} registry={registry} />
              {process.env.NODE_ENV === "development" && (
                <details className="mt-6">
                  <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-600">
                    Debug: raw spec (dev only)
                  </summary>
                  <pre className="mt-2 text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(spec, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </JSONUIProvider>
  );
}

export default memo(GenerativeDashboard);
