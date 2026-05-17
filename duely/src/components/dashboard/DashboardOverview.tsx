"use client";

import { useState } from "react";
import { AlertTriangle, CalendarClock, DollarSign, FileText } from "lucide-react";
import type { DashboardData } from "@/types";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatusBadge, ToneBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceDetailDialog } from "@/components/dashboard/InvoiceDetailDialog";
import { InsightsWidget } from "@/components/dashboard/InsightsWidget";

export function DashboardOverview({ data }: { data: DashboardData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total invoices" value={data.stats.total_invoices} trend={data.stats.total_invoices_trend} icon={FileText} />
        <StatsCard label="Unpaid amount" value={data.stats.unpaid_amount} trend={data.stats.unpaid_amount_trend} icon={DollarSign} currency />
        <StatsCard label="Overdue" value={data.stats.overdue_count} trend={data.stats.overdue_count_trend} icon={AlertTriangle} />
        <StatsCard label="Paid this month" value={data.stats.paid_this_month} trend={data.stats.paid_this_month_trend} icon={CalendarClock} currency />
      </div>

      <InsightsWidget />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <CardTitle className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Recent invoices</CardTitle>
          </CardHeader>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recent_invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    onClick={() => setSelectedId(invoice.id)}
                  >
                    <TableCell className="font-mono font-semibold text-zinc-950 dark:text-zinc-50">{invoice.invoice_number}</TableCell>
                    <TableCell className="text-zinc-700 dark:text-zinc-300">{invoice.client?.name}</TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">{formatDate(invoice.due_date)}</TableCell>
                    <TableCell><StatusBadge status={invoice.status} /></TableCell>
                    <TableCell className="text-right font-mono font-semibold text-zinc-950 dark:text-zinc-50">{formatCurrency(invoice.total_amount, invoice.currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 sm:hidden">
            {data.recent_invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors active:bg-zinc-100 dark:active:bg-zinc-900"
                onClick={() => setSelectedId(invoice.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono font-semibold text-zinc-950 dark:text-zinc-50">{invoice.invoice_number}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{invoice.client?.name}</p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Due {formatDate(invoice.due_date)}</p>
                  <p className="font-mono font-semibold text-zinc-950 dark:text-zinc-50">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <CardTitle className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Upcoming reminders</CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-zinc-100 dark:divide-zinc-800">
            {data.upcoming_reminders.map((reminder) => (
              <div key={reminder.id} className="p-4 md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-50">{reminder.invoice?.invoice_number}</p>
                  <ToneBadge tone={reminder.tone} />
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{reminder.invoice?.client?.name}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Scheduled for {formatDate(reminder.scheduled_for)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {selectedId && (
        <InvoiceDetailDialog
          key={selectedId}
          invoiceId={selectedId}
          open={!!selectedId}
          onOpenChange={(open) => !open && setSelectedId(null)}
        />
      )}
    </div>
  );
}
