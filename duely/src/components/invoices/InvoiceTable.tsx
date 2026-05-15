"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Search, Send } from "lucide-react";
import type { Client, Invoice } from "@/types";
import { CreateInvoiceDialog } from "@/components/invoices/CreateInvoiceDialog";
import { SendReminderDialog } from "@/components/invoices/SendReminderDialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function InvoiceTable({ invoices, clients }: { invoices: Invoice[]; clients: Client[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus = status === "all" || invoice.status === status;
      const haystack = `${invoice.invoice_number} ${invoice.client?.name} ${invoice.description}`.toLowerCase();
      return matchesStatus && haystack.includes(query.toLowerCase());
    });
  }, [invoices, query, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-950">Invoices</h2>
          <p className="text-sm text-zinc-500">Create, track, and remind clients without awkward follow-ups.</p>
        </div>
        <CreateInvoiceDialog clients={clients} nextInvoiceNumber={`INV-${String(invoices.length + 38).padStart(4, "0")}`} />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 md:flex-row">
        <label className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-zinc-200 px-3">
          <Search className="h-4 w-4 text-zinc-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoices" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-indigo-500">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Invoice</th>
                <th className="px-5 py-3 text-left font-medium">Client</th>
                <th className="px-5 py-3 text-left font-medium">Due</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice) => (
                <tr key={invoice.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                  <td className="px-5 py-4">
                    <p className="font-mono font-semibold text-zinc-950">{invoice.invoice_number}</p>
                    <p className="text-xs text-zinc-500">{invoice.description}</p>
                  </td>
                  <td className="px-5 py-4 text-zinc-700">{invoice.client?.name}</td>
                  <td className="px-5 py-4 text-zinc-600">{formatDate(invoice.due_date)}</td>
                  <td className="px-5 py-4"><StatusBadge status={invoice.status} /></td>
                  <td className="px-5 py-4 text-right font-mono font-semibold text-zinc-950">{formatCurrency(invoice.total_amount, invoice.currency)}</td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(invoice)}>
                      <Send className="h-4 w-4" />
                      Remind
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-zinc-100 md:hidden">
          {filtered.map((invoice) => (
            <div key={invoice.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono font-semibold text-zinc-950">{invoice.invoice_number}</p>
                  <p className="text-sm text-zinc-600">{invoice.client?.name}</p>
                </div>
                <StatusBadge status={invoice.status} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-mono font-semibold">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
                <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" onClick={() => setSelected(invoice)} aria-label="Invoice actions">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected ? <SendReminderDialog invoice={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
