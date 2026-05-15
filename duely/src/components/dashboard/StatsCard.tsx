import type { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  trend,
  icon: Icon,
  currency,
}: {
  label: string;
  value: number;
  trend: number;
  icon: LucideIcon;
  currency?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-zinc-950">{currency ? formatCurrency(value) : value}</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={cn("mt-4 text-xs font-medium", trend >= 0 ? "text-green-600" : "text-red-500")}>
        {trend >= 0 ? "+" : ""}
        {trend}% vs last month
      </p>
    </div>
  );
}
