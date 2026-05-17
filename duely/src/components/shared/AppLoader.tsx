"use client";

import { LoaderThree } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

type AppLoaderProps = {
  className?: string;
  compact?: boolean;
  label?: string;
};

export function AppLoader({
  className,
  compact = false,
  label = "Loading Duely",
}: AppLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60dvh] w-full items-center justify-center bg-background px-4",
        compact && "min-h-64",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="text-zinc-500 dark:text-zinc-300">
          <LoaderThree />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}
