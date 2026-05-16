"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Search, Send } from "lucide-react";
import type { Client, Invoice } from "@/types";
import { CreateInvoiceDialog } from "@/components/invoices/CreateInvoiceDialog";
import { SendReminderDialog } from "@/components/invoices/SendReminderDialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">Invoices</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Create, track, and remind clients without awkward follow-ups.</p>
        </div>
        <CreateInvoiceDialog clients={clients} nextInvoiceNumber={`INV-${String(invoices.length + 38).padStart(4, "0")}`} />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder="Search invoices" 
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={status} onValueChange={(val) => setStatus(val ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <p className="font-mono font-semibold text-zinc-950 dark:text-zinc-50">{invoice.invoice_number}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{invoice.description}</p>
                    </TableCell>
                    <TableCell className="text-zinc-700 dark:text-zinc-300">{invoice.client?.name}</TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">{formatDate(invoice.due_date)}</TableCell>
                    <TableCell><StatusBadge status={invoice.status} /></TableCell>
                    <TableCell className="text-right font-mono font-semibold text-zinc-950 dark:text-zinc-50">{formatCurrency(invoice.total_amount, invoice.currency)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(invoice)}>
                        <Send className="h-4 w-4" />
                        Remind
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="divide-y divide-zinc-100 md:hidden">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No invoices found.
            </div>
          ) : (
            filtered.map((invoice) => (
              <div key={invoice.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono font-semibold text-zinc-950 dark:text-zinc-50">{invoice.invoice_number}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{invoice.client?.name}</p>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="font-mono font-semibold">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
                  <button className="rounded-lg p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800" onClick={() => setSelected(invoice)} aria-label="Invoice actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selected ? <SendReminderDialog invoice={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}
