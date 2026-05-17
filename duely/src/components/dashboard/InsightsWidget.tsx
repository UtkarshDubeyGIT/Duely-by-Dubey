"use client";

import { useEffect, useState } from "react";
import { Sparkles, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function InsightsWidget() {
  const [insights, setInsights] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<"no_data" | "no_key" | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    setReason(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch insights");
      }
      const data = await res.json();
      if (data.reason === "no_data") {
        setReason("no_data");
        setInsights(null);
      } else if (data.reason === "no_key") {
        setReason("no_key");
        setInsights(null);
      } else if (data.insights) {
        setInsights(data.insights);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load insights. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  // Hide entirely in production if no GROK_API_KEY is configured
  if (reason === "no_key" && process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm flex flex-col gap-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-[18px] w-[18px] text-indigo-600 shrink-0" />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            AI Insights
          </span>
        </div>

        {/* Refresh Button - Hide if NO_DATA, visible otherwise (even during loading/error) */}
        {reason !== "no_data" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchInsights}
            disabled={loading}
            className="text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
            title="Refresh insights"
          >
            <RotateCw
              className={cn("h-3.5 w-3.5 mr-1 text-current", loading && "animate-spin")}
            />
            Refresh
          </Button>
        )}
      </div>

      {/* States */}
      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full bg-zinc-100 dark:bg-zinc-900" />
            <Skeleton className="h-4 w-[92%] bg-zinc-100 dark:bg-zinc-900" />
            <Skeleton className="h-4 w-[95%] bg-zinc-100 dark:bg-zinc-900" />
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Analyzing your business data...
          </span>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-100 dark:border-red-950/40 text-sm text-red-500 dark:text-red-400 font-medium">
          {error}
        </div>
      ) : reason === "no_data" ? (
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900/50 p-4 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center min-h-[100px]">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 text-center font-medium">
            Add your first invoice to unlock AI insights.
          </span>
        </div>
      ) : reason === "no_key" ? (
        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900/50 p-4 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center min-h-[100px]">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 text-center font-medium">
            AI insights unavailable — GROK_API_KEY not configured.
          </span>
        </div>
      ) : insights && insights.length > 0 ? (
        <div className="flex flex-col">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {insight}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            Generated just now · Powered by Grok
          </div>
        </div>
      ) : null}
    </div>
  );
}
