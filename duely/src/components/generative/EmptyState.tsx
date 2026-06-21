"use client";

import type { BaseComponentProps } from "@json-render/react";
import { FileText } from "lucide-react";
import type {} from "react";

interface EmptyStateProps {
  title: string;
  body?: string | undefined;
  actionLabel?: string | undefined;
}

function EmptyStateImpl({ props }: BaseComponentProps<EmptyStateProps>) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[200px]">
      <FileText className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-4" />
      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {props.title}
      </p>
      {props.body && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
          {props.body}
        </p>
      )}
      {props.actionLabel && (
        <button className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          {props.actionLabel}
        </button>
      )}
    </div>
  );
}

export const EmptyState = EmptyStateImpl;
