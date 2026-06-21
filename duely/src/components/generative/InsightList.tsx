"use client";

import type { BaseComponentProps } from "@json-render/react";
import { Sparkles } from "lucide-react";
import type {} from "react";

interface InsightListProps {
  title?: string | undefined;
  items?: string[] | undefined;
  generatedAt?: string | undefined;
}

function InsightListImpl({ props }: BaseComponentProps<InsightListProps>) {
  const items = props.items ?? [];

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm">
      {props.title && (
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-[18px] w-[18px] text-indigo-600 shrink-0" />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {props.title}
          </span>
        </div>
      )}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {items.map((insight, index) => (
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
      {props.generatedAt && (
        <div className="mt-4 text-right text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium">
          {props.generatedAt}
        </div>
      )}
    </div>
  );
}

export const InsightList = InsightListImpl;
