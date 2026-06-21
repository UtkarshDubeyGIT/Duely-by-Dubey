"use client";

import type { BaseComponentProps } from "@json-render/react";
import { cn } from "@/lib/utils";
import type {} from "react";

interface GridProps {
  cols?: "2" | "3" | "4" | undefined;
  gap?: "4" | "6" | undefined;
}

function GridImpl({ props, children }: BaseComponentProps<GridProps>) {
  const cols = props.cols ?? "4";
  const gap = props.gap ?? "6";

  const colClass = {
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-2 xl:grid-cols-4",
  }[cols];

  const gapClass = {
    "4": "gap-4",
    "6": "gap-6",
  }[gap];

  return <div className={cn("grid", colClass, gapClass)}>{children}</div>;
}

export const Grid = GridImpl;
