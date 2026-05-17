import type { ClientReliability, Invoice } from "@/types";

/**
 * Reliability scoring thresholds.
 *
 * The algorithm considers:
 *  1. Total completed invoices (paid) — need ≥ 1 to leave "new"
 *  2. Average days late across paid invoices
 *  3. On-time payment ratio (paid on or before due date)
 *  4. Currently overdue count
 *
 * Scoring bands:
 *  - "new"       → < 1 completed invoices
 *  - "reliable"  → avg ≤ 3 days late AND ≥ 80% on-time AND 0 currently overdue
 *  - "at_risk"   → avg > 10 days late OR on-time ratio < 40% OR ≥ 2 currently overdue
 *  - "slow"      → everything in between
 */

export interface ReliabilityAnalysis {
  tag: ClientReliability;
  avgDaysLate: number;
  onTimeRatio: number;          // 0..1
  totalPaid: number;
  totalInvoices: number;
  currentlyOverdue: number;
  paymentTimeline: PaymentTimelineEntry[];
}

export interface PaymentTimelineEntry {
  invoiceNumber: string;
  invoiceId: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidDate: string | null;
  status: string;
  daysLate: number;           // negative = early, 0 = on-time, positive = late
  onTime: boolean;
}

/**
 * Compute the number of days between the due date and the paid date.
 * Negative = paid early, 0 = on time, positive = late.
 */
function computeDaysLate(dueDate: string, paidDate: string | null): number {
  if (!paidDate) return 0;
  const due = new Date(`${dueDate}T23:59:59`);
  const paid = new Date(paidDate);
  return Math.round((paid.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Full reliability analysis for a client based on their invoice history.
 */
export function analyzeClientReliability(invoices: Invoice[]): ReliabilityAnalysis {
  // Filter only invoices that are relevant (not draft)
  const relevant = invoices.filter((inv) => inv.status !== "draft");
  const paid = relevant.filter((inv) => inv.status === "paid");
  const overdue = relevant.filter((inv) => inv.status === "overdue");

  // Build payment timeline (sorted newest first)
  const paymentTimeline: PaymentTimelineEntry[] = relevant
    .map((inv) => {
      const daysLate = inv.status === "paid"
        ? computeDaysLate(inv.due_date, inv.paid_date)
        : inv.status === "overdue"
          ? computeDaysLate(inv.due_date, new Date().toISOString())
          : 0;

      return {
        invoiceNumber: inv.invoice_number,
        invoiceId: inv.id,
        amount: inv.total_amount,
        currency: inv.currency,
        dueDate: inv.due_date,
        paidDate: inv.paid_date,
        status: inv.status,
        daysLate,
        onTime: inv.status === "paid" ? daysLate <= 0 : false,
      };
    })
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  // Not enough data → "new"
  if (paid.length === 0) {
    return {
      tag: "new",
      avgDaysLate: 0,
      onTimeRatio: 0,
      totalPaid: 0,
      totalInvoices: relevant.length,
      currentlyOverdue: overdue.length,
      paymentTimeline,
    };
  }

  // Compute average days late (only for paid invoices, clamped to 0 min)
  const daysLateValues = paid.map((inv) => Math.max(0, computeDaysLate(inv.due_date, inv.paid_date)));
  const avgDaysLate = daysLateValues.reduce((sum, d) => sum + d, 0) / daysLateValues.length;

  // Compute on-time ratio
  const onTimeCount = paid.filter((inv) => computeDaysLate(inv.due_date, inv.paid_date) <= 0).length;
  const onTimeRatio = onTimeCount / paid.length;

  const currentlyOverdue = overdue.length;

  // Determine tag
  let tag: ClientReliability;
  if (avgDaysLate > 10 || onTimeRatio < 0.4 || currentlyOverdue >= 2) {
    tag = "at_risk";
  } else if (avgDaysLate <= 3 && onTimeRatio >= 0.8 && currentlyOverdue === 0) {
    tag = "reliable";
  } else {
    tag = "slow";
  }

  return {
    tag,
    avgDaysLate: Math.round(avgDaysLate * 10) / 10,
    onTimeRatio: Math.round(onTimeRatio * 100) / 100,
    totalPaid: paid.length,
    totalInvoices: relevant.length,
    currentlyOverdue,
    paymentTimeline,
  };
}

/**
 * Simple tag-only computation (used when persisting to DB).
 */
export function computeReliabilityTag(invoices: Invoice[]): ClientReliability {
  return analyzeClientReliability(invoices).tag;
}

/**
 * Compute the avg_days_late value to store on the client record.
 */
export function computeAvgDaysLate(invoices: Invoice[]): number {
  return analyzeClientReliability(invoices).avgDaysLate;
}
