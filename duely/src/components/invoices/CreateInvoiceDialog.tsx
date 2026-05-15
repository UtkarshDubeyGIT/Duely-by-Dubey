"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Client } from "@/types";
import { Button } from "@/components/ui/button";

export function CreateInvoiceDialog({ clients, nextInvoiceNumber }: { clients: Client[]; nextInvoiceNumber: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const amount = Number(formData.get("amount") || 0);
    const payload = {
      client_id: String(formData.get("client_id") || ""),
      invoice_number: String(formData.get("invoice_number") || nextInvoiceNumber),
      amount,
      currency: "USD",
      tax_rate: Number(formData.get("tax_rate") || 0),
      issued_date: String(formData.get("issued_date") || ""),
      due_date: String(formData.get("due_date") || ""),
      description: String(formData.get("description") || ""),
      notes: String(formData.get("notes") || ""),
      line_items: [
        {
          description: String(formData.get("description") || "Professional services"),
          qty: 1,
          price: amount,
          amount,
        },
      ],
    };

    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Invoice could not be created.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        New Invoice
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 sm:items-center sm:justify-center sm:p-4">
          <div className="w-full rounded-t-2xl bg-white sm:max-w-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 p-5">
              <h3 className="text-lg font-semibold text-zinc-950">Create invoice</h3>
              <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form action={onSubmit} className="grid gap-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                  Invoice number
                  <input name="invoice_number" defaultValue={nextInvoiceNumber} className="h-9 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-500" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                  Client
                  <select name="client_id" required className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-indigo-500">
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                  Amount
                  <input name="amount" type="number" min="1" step="0.01" required defaultValue="1200" className="h-9 rounded-lg border border-zinc-200 px-3 font-mono text-sm outline-none focus:border-indigo-500" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                  Tax rate
                  <input name="tax_rate" type="number" min="0" max="100" step="0.01" defaultValue="0" className="h-9 rounded-lg border border-zinc-200 px-3 font-mono text-sm outline-none focus:border-indigo-500" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                  Issued date
                  <input name="issued_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="h-9 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-500" />
                </label>
                <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                  Due date
                  <input name="due_date" type="date" required defaultValue="2026-05-29" className="h-9 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-500" />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                Description
                <input name="description" required defaultValue="Professional services" className="h-9 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-500" />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                Notes
                <textarea name="notes" rows={3} className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              </label>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="accent" disabled={loading}>{loading ? "Creating..." : "Create invoice"}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
