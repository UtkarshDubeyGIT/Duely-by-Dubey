"use client";

import type { BaseComponentProps } from "@json-render/react";
import { useStateValue } from "@json-render/react";
import type {} from "react";

interface BadgeClusterProps {
  dataPath: string;
  labelKey?: string | undefined;
  valueKey?: string | undefined;
  colorKey?: string | undefined;
}

const colorMap: Record<string, string> = {
  reliable: "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400",
  slow: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
  at_risk: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400",
  new: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
  overdue: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400",
  draft: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
};

function BadgeClusterImpl({ props }: BaseComponentProps<BadgeClusterProps>) {
  const items = (useStateValue<Record<string, unknown>[]>(props.dataPath) ?? []) as Record<string, unknown>[];
  const labelKey = props.labelKey ?? "name";
  const valueKey = props.valueKey;
  const colorKey = props.colorKey;

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => {
        const label = String(item[labelKey] ?? "");
        const value = valueKey ? String(item[valueKey] ?? "") : "";
        const color = colorKey
          ? colorMap[String(item[colorKey] ?? "")] ??
            "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
          : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";

        return (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${color}`}
          >
            {label}
            {value && (
              <span className="opacity-60 ml-0.5">{value}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export const BadgeCluster = BadgeClusterImpl;
