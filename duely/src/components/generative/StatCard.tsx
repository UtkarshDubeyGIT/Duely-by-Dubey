"use client";

import type { BaseComponentProps } from "@json-render/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import type {} from "react";
import {
  FileText,
  DollarSign,
  AlertTriangle,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  Users,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number | undefined;
  currency?: boolean | undefined;
  icon?: string | undefined;
  trendLabel?: string | undefined;
}

const iconMap: Record<string, LucideIcon> = {
  FileText,
  DollarSign,
  AlertTriangle,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  Users,
  Bell,
};

function StatCardImpl({ props }: BaseComponentProps<StatCardProps>) {
  const Icon = props.icon ? iconMap[props.icon] : null;
  const displayValue =
    typeof props.value === "number" ? props.value : Number(props.value);
  const numericValue = Number.isNaN(displayValue) ? 0 : displayValue;
  const hasTrend = props.trend != null && props.trend !== undefined;

  return (
    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {props.label}
        </CardTitle>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="font-mono text-xl font-bold text-zinc-950 dark:text-zinc-50 sm:text-2xl truncate">
          {props.currency && !Number.isNaN(numericValue) ? (
            <span>{formatCurrency(numericValue)}</span>
          ) : (
            <NumberTicker value={numericValue} />
          )}
        </div>
        {hasTrend && (
          <p
            className={cn(
              "mt-1 text-xs font-medium",
              props.trend! >= 0 ? "text-green-600" : "text-red-500"
            )}
          >
            {props.trend! >= 0 ? "+" : ""}
            {props.trend}%
            {props.trendLabel ? ` ${props.trendLabel}` : " vs last month"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export const StatCard = StatCardImpl;
