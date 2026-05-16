"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { Invoice, ReminderTone } from "@/types";
import { Button } from "@/components/ui/button";
import { ToneBadge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send reminder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
              <button key={item} onClick={() => setTone(item)} className={tone === item ? "rounded-lg border border-indigo-600 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700" : "rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"}>
                {item.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customMessage">Custom message</Label>
            <textarea id="customMessage" value={customMessage} onChange={(event) => setCustomMessage(event.target.value)} rows={4} placeholder="Optional note for this client" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-600">
            Tone preview <ToneBadge tone={tone} />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          {result && <p className="text-sm font-medium text-green-700">{result}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button variant="accent" onClick={send} disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send reminder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
