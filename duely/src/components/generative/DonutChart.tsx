"use client";

import type { BaseComponentProps } from "@json-render/react";
import { useStateValue } from "@json-render/react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";

interface DonutChartProps {
  title?: string | undefined;
  dataPath: string;
  nameKey: string;
  valueKey: string;
  colors?: string[] | undefined;
  height?: number | undefined;
}

const DEFAULT_COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

function DonutChartImpl({ props }: BaseComponentProps<DonutChartProps>) {
  const data = (useStateValue<Record<string, unknown>[]>(props.dataPath) ?? []) as Record<string, unknown>[];
  const height = props.height ?? 280;

  return (
    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      {props.title && (
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {props.title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={props.title ? "pt-4" : "p-4"}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPie>
            <Pie
              data={data}
              dataKey={props.valueKey}
              nameKey={props.nameKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    (props.colors ?? DEFAULT_COLORS)[
                      index % (props.colors ?? DEFAULT_COLORS).length
                    ]
                  }
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                backgroundColor: "var(--tooltip-bg, white)",
              }}
            />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export { DonutChartImpl as DonutChart };
export default memo(DonutChartImpl);
