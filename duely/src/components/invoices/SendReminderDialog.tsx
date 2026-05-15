"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import type { Invoice, ReminderTone } from "@/types";
import { Button } from "@/components/ui/button";
import { ToneBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function SendReminderDialog({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const [tone, setTone] = useState<ReminderTone>(invoice.status === "overdue" ? "firm" : "friendly");
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setLoading(true);
    setError(null);
    setResult(null);
    const response = await fetch(`/api/invoices/${invoice.id}/remind`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice_id: invoice.id, tone, custom_message: customMessage }),
    });
    const body = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(body?.error ?? "Reminder could not be sent.");
      return;
    }

    setResult(body?.skipped ? "Reminder simulated because Resend is not configured." : "Reminder sent.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 sm:items-center sm:justify-center sm:p-4">
      <div className="w-full rounded-t-2xl bg-white sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 p-5">
          <h3 className="text-lg font-semibold text-zinc-950">Send reminder</h3>
          <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono font-semibold text-zinc-950">{invoice.invoice_number}</p>
                <p className="text-sm text-zinc-600">{invoice.client?.name} - due {formatDate(invoice.due_date)}</p>
              </div>
              <p className="font-mono font-semibold text-zinc-950">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(["friendly", "firm", "final_notice"] as ReminderTone[]).map((item) => (
              <button key={item} onClick={() => setTone(item)} className={tone === item ? "rounded-lg border border-indigo-600 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700" : "rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"}>
                {item.replace("_", " ")}
              </button>
            ))}
          </div>

          <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
            Custom message
            <textarea value={customMessage} onChange={(event) => setCustomMessage(event.target.value)} rows={4} placeholder="Optional note for this client" className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
          </label>

          <div className="flex items-center gap-2 text-sm text-zinc-600">
            Tone preview <ToneBadge tone={tone} />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {result ? <p className="text-sm text-green-700">{result}</p> : null}

          <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button variant="accent" onClick={send} disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send reminder"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
