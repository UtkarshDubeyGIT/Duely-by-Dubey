"use client";

import type { BaseComponentProps } from "@json-render/react";
import { useStateValue } from "@json-render/react";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";

interface LineChartProps {
  title?: string | undefined;
  dataPath: string;
  xKey: string;
  yKeys: string[];
  colors?: string[] | undefined;
  height?: number | undefined;
}

const DEFAULT_COLORS = ["#4f46e5", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"];

function LineChartImpl({ props }: BaseComponentProps<LineChartProps>) {
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
          <RechartsLine
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-600"
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                backgroundColor: "var(--tooltip-bg, white)",
              }}
            />
            {props.yKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={
                  props.colors?.[i] ??
                  DEFAULT_COLORS[i % DEFAULT_COLORS.length]
                }
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
            <Legend />
          </RechartsLine>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export { LineChartImpl as LineChart };
export default memo(LineChartImpl);
