import { AlertTriangle, CalendarClock, DollarSign, FileText } from "lucide-react";
import type { DashboardData } from "@/types";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatusBadge, ToneBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function DashboardOverview({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total invoices" value={data.stats.total_invoices} trend={data.stats.total_invoices_trend} icon={FileText} />
        <StatsCard label="Unpaid amount" value={data.stats.unpaid_amount} trend={data.stats.unpaid_amount_trend} icon={DollarSign} currency />
        <StatsCard label="Overdue" value={data.stats.overdue_count} trend={data.stats.overdue_count_trend} icon={AlertTriangle} />
        <StatsCard label="Paid this month" value={data.stats.paid_this_month} trend={data.stats.paid_this_month_trend} icon={CalendarClock} currency />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Recent invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Invoice</th>
                  <th className="px-5 py-3 text-left font-medium">Client</th>
                  <th className="px-5 py-3 text-left font-medium">Due</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                    <td className="px-5 py-4 font-mono font-semibold text-zinc-950">{invoice.invoice_number}</td>
                    <td className="px-5 py-4 text-zinc-700">{invoice.client?.name}</td>
                    <td className="px-5 py-4 text-zinc-600">{formatDate(invoice.due_date)}</td>
                    <td className="px-5 py-4"><StatusBadge status={invoice.status} /></td>
                    <td className="px-5 py-4 text-right font-mono font-semibold text-zinc-950">{formatCurrency(invoice.total_amount, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Upcoming reminders</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {data.upcoming_reminders.map((reminder) => (
              <div key={reminder.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-sm font-semibold text-zinc-950">{reminder.invoice?.invoice_number}</p>
                  <ToneBadge tone={reminder.tone} />
                </div>
                <p className="mt-2 text-sm text-zinc-600">{reminder.invoice?.client?.name}</p>
                <p className="mt-1 text-xs text-zinc-500">Scheduled for {formatDate(reminder.scheduled_for)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
