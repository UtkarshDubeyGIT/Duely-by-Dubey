import type { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-2xl font-bold text-zinc-950 dark:text-zinc-50">
          {currency ? formatCurrency(value) : value}
        </div>
        <p className={cn("mt-1 text-xs font-medium", trend >= 0 ? "text-green-600" : "text-red-500")}>
          {trend >= 0 ? "+" : ""}
          {trend}% vs last month
        </p>
      </CardContent>
    </Card>
  );
}
