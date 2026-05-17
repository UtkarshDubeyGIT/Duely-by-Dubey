"use client";

import type { ReliabilityAnalysis, PaymentTimelineEntry } from "@/lib/reliability";
import type { ClientReliability } from "@/types";
import { ReliabilityBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  XCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function MetricCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 sm:p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">{label}</p>
        <p className="text-lg font-bold text-zinc-950 dark:text-zinc-50">{value}</p>
      </div>
    </div>
  );
}

function TimelineItem({ entry }: { entry: PaymentTimelineEntry }) {
  const isOverdue = entry.status === "overdue";
  const isPending = entry.status === "pending";
  const isPaid = entry.status === "paid";

  let dotColor = "bg-zinc-300 dark:bg-zinc-600";
  let StatusIcon = Clock;
  let statusText = "Pending";

  if (isPaid && entry.onTime) {
    dotColor = "bg-green-500";
    StatusIcon = CheckCircle2;
    statusText = entry.daysLate < 0 ? `${Math.abs(entry.daysLate)}d early` : "On time";
  } else if (isPaid && !entry.onTime) {
    dotColor = "bg-amber-500";
    StatusIcon = Clock;
    statusText = `${entry.daysLate}d late`;
  } else if (isOverdue) {
    dotColor = "bg-red-500";
    StatusIcon = XCircle;
    statusText = `${entry.daysLate}d overdue`;
  } else if (isPending) {
    dotColor = "bg-blue-500";
    StatusIcon = Clock;
    statusText = "Awaiting payment";
  }

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0 group">
      {/* Vertical line connector */}
      <div className="flex flex-col items-center">
        <div className={`h-3 w-3 rounded-full ${dotColor} ring-4 ring-white dark:ring-zinc-950 shrink-0 z-10 transition-transform group-hover:scale-125`} />
        <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800 group-last:hidden" />
      </div>

      {/* Content */}
      <div className="flex-1 -mt-0.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            {entry.invoiceNumber}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{
            backgroundColor: isPaid && entry.onTime
              ? "rgb(220 252 231)" : isPaid && !entry.onTime
              ? "rgb(254 243 199)" : isOverdue
              ? "rgb(254 226 226)" : "rgb(219 234 254)",
            color: isPaid && entry.onTime
              ? "rgb(21 128 61)" : isPaid && !entry.onTime
              ? "rgb(161 98 7)" : isOverdue
              ? "rgb(185 28 28)" : "rgb(29 78 216)",
          }}>
            <StatusIcon className="h-3 w-3" />
            {statusText}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{formatCurrency(entry.amount, entry.currency)}</span>
          <span>Due {formatDate(entry.dueDate)}</span>
          {entry.paidDate && <span>Paid {formatDate(entry.paidDate)}</span>}
        </div>
      </div>
    </div>
  );
}

function ReliabilityExplanation({ tag }: { tag: ClientReliability }) {
  const explanations: Record<ClientReliability, { text: string; suggestion: string }> = {
    reliable: {
      text: "This client consistently pays on time with minimal follow-up needed.",
      suggestion: "Standard reminder schedule works well for this client.",
    },
    slow: {
      text: "This client occasionally pays late but usually settles eventually.",
      suggestion: "Consider sending reminders a few days earlier for this client.",
    },
    at_risk: {
      text: "This client frequently misses deadlines or has multiple overdue invoices.",
      suggestion: "Use a firm tone and escalate follow-up frequency. Consider prepayment terms.",
    },
    new: {
      text: "Not enough payment history to determine reliability.",
      suggestion: "Monitor initial payments closely to establish a baseline.",
    },
  };

  const { text, suggestion } = explanations[tag];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{text}</p>
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 italic">{suggestion}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ClientPaymentHistory({ analysis }: { analysis: ReliabilityAnalysis }) {
  const { tag, avgDaysLate, onTimeRatio, totalPaid, totalInvoices, currentlyOverdue, paymentTimeline } = analysis;

  const onTimePercent = Math.round(onTimeRatio * 100);

  const trendIcon = avgDaysLate <= 3
    ? TrendingDown
    : avgDaysLate <= 10
      ? Minus
      : TrendingUp;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Payment Behaviour</h3>
        <ReliabilityBadge reliability={tag} />
      </div>

      {/* Explanation */}
      <ReliabilityExplanation tag={tag} />

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Avg. Days Late"
          value={avgDaysLate}
          icon={trendIcon}
          color={
            avgDaysLate <= 3
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : avgDaysLate <= 10
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }
        />
        <MetricCard
          label="On-Time Rate"
          value={`${onTimePercent}%`}
          icon={CheckCircle2}
          color={
            onTimePercent >= 80
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : onTimePercent >= 40
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }
        />
        <MetricCard
          label="Invoices Paid"
          value={`${totalPaid} / ${totalInvoices}`}
          icon={CheckCircle2}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <MetricCard
          label="Currently Overdue"
          value={currentlyOverdue}
          icon={AlertTriangle}
          color={
            currentlyOverdue === 0
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }
        />
      </div>

      {/* Payment Timeline */}
      {paymentTimeline.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Payment Timeline</h4>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
            {paymentTimeline.map((entry) => (
              <TimelineItem key={entry.invoiceId} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {paymentTimeline.length === 0 && (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-center">
          <Clock className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">No invoice history yet.</p>
        </div>
      )}
    </div>
  );
}
