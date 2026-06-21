"use client";

import dynamic from "next/dynamic";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 -mx-4 px-4 py-3 flex items-center gap-3 bg-white dark:bg-zinc-950">
        <div className="h-4 w-4 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse" />
        <div className="flex-1 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 h-28 animate-pulse"
          >
            <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded mb-3" />
            <div className="h-6 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-64 animate-pulse" />
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-64 animate-pulse" />
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-48 animate-pulse" />
      <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
        Loading your Smart Dashboard…
      </p>
    </div>
  );
}

const GenerativeDashboard = dynamic(
  () => import("@/components/generative/GenerativeDashboard"),
  { ssr: false, loading: () => <DashboardSkeleton /> }
);

export function SmartDashboardClient({
  initialState,
}: {
  initialState: Record<string, unknown>;
}) {
  return <GenerativeDashboard initialState={initialState} />;
}
