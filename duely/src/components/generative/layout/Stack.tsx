"use client";

import type { BaseComponentProps } from "@json-render/react";
import { cn } from "@/lib/utils";

interface StackProps {
  gap?: "2" | "4" | "6" | "8";
}

export function Stack({ props, children }: BaseComponentProps<StackProps>) {
  const gap = props.gap ?? "6";
  const gapClass = {
    "2": "gap-2",
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
  }[gap];

  return <div className={cn("flex flex-col", gapClass)}>{children}</div>;
}
