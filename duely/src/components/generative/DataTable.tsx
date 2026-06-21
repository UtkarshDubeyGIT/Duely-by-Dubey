"use client";

import type { BaseComponentProps } from "@json-render/react";
import { useStateValue } from "@json-render/react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {} from "react";

type Column = {
  key: string;
  label: string;
  format?: "currency" | "date" | "badge" | "text" | null;
};

interface DataTableProps {
  title?: string | undefined;
  dataPath: string;
  columns: Column[];
  maxRows?: number | undefined;
  emptyMessage?: string | undefined;
}

function DataTableImpl({ props }: BaseComponentProps<DataTableProps>) {
  const rows = (useStateValue<Record<string, unknown>[]>(props.dataPath) ?? []) as Record<string, unknown>[];
  const columns = props.columns;
  const maxRows = props.maxRows ?? 10;
  const emptyMessage = props.emptyMessage ?? "No data available";
  const displayRows = rows.slice(0, maxRows);

  function formatCell(value: unknown, format: Column["format"]): string {
    if (value == null) return "-";
    switch (format) {
      case "currency":
        return formatCurrency(Number(value) || 0);
      case "date":
        return formatDate(String(value));
      case "badge":
        return String(value);
      case "text":
      default:
        return String(value);
    }
  }

  if (displayRows.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-center shadow-sm">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
      {props.title && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {props.title}
          </h3>
        </div>
      )}

      <div className="hidden overflow-x-auto sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((row, idx) => (
              <TableRow key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                {columns.map((col) => {
                  const rawValue = row[col.key];
                  if (col.format === "badge") {
                    const statusStr = String(rawValue ?? "");
                    const badgeStyle =
                      statusStr === "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : statusStr === "pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : statusStr === "overdue"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
                    return (
                      <TableCell key={col.key}>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyle}`}
                        >
                          {statusStr}
                        </span>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell
                      key={col.key}
                      className={col.format === "currency" ? "text-right font-mono" : ""}
                    >
                      {formatCell(rawValue, col.format)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 sm:hidden">
        {displayRows.map((row, idx) => (
          <div key={idx} className="p-4">
            {columns.map((col, colIdx) => {
              const rawValue = row[col.key];
              return (
                <div
                  key={col.key}
                  className={`flex items-center justify-between ${colIdx > 0 ? "mt-1" : ""}`}
                >
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {col.label}
                  </span>
                  {col.format === "badge" ? (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        String(rawValue ?? "") === "paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : String(rawValue ?? "") === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : String(rawValue ?? "") === "overdue"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {String(rawValue ?? "")}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {formatCell(rawValue, col.format)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export const DataTable = DataTableImpl;
