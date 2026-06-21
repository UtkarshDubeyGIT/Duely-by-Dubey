"use client";

import type { BaseComponentProps } from "@json-render/react";
import { useStateValue } from "@json-render/react";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";

interface BarChartProps {
  title?: string | undefined;
  dataPath: string;
  xKey: string;
  yKey: string;
  color?: string | undefined;
  height?: number | undefined;
  horizontal?: boolean | undefined;
}

const DEFAULT_COLOR = "#4f46e5";

function BarChartImpl({ props }: BaseComponentProps<BarChartProps>) {
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
          <RechartsBar
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            layout={props.horizontal ? "vertical" : "horizontal"}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800"
            />
            <XAxis
              dataKey={props.xKey}
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-600"
              type={props.horizontal ? "number" : "category"}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-600"
              type={props.horizontal ? "category" : "number"}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                backgroundColor: "var(--tooltip-bg, white)",
              }}
            />
            <Bar
              dataKey={props.yKey}
              fill={props.color ?? DEFAULT_COLOR}
              radius={[4, 4, 0, 0]}
            />
            <Legend />
          </RechartsBar>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export { BarChartImpl as BarChart };
export default memo(BarChartImpl);
