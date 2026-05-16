"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Mail, 
  Send, 
  Calendar, 
  User, 
  DollarSign,
  AlertCircle,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge, ToneBadge } from "@/components/ui/badge";
import type { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { SendReminderDialog } from "@/components/invoices/SendReminderDialog";

export function InvoiceDetailDialog({ 
  invoiceId, 
  open, 
  onOpenChange 
}: { 
  invoiceId: string; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdateLoading] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      const result = await response.json();
      if (response.ok) {
        setInvoice(result.data);
      } else {
        setError(result.error || "Failed to load invoice");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    if (open && invoiceId) {
      setTimeout(() => fetchInvoice(), 0);
    }
  }, [open, invoiceId, fetchInvoice]);

  const updateStatus = async (status: string) => {
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const result = await response.json();
        setInvoice(result.data);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteInvoice = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onOpenChange(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete invoice", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-3 text-zinc-950 dark:text-zinc-50">
                <DialogTitle className="text-xl font-mono">
                  {invoice?.invoice_number || "Loading..."}
                </DialogTitle>
                {invoice && <StatusBadge status={invoice.status} />}
              </div>
            </div>
          </DialogHeader>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-sm text-zinc-500">Loading invoice details...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">
              <AlertCircle className="mx-auto h-10 w-10 mb-4" />
              <p>{error}</p>
            </div>
          ) : invoice ? (
            <div className="grid gap-8 py-4 lg:grid-cols-2">
              {/* Left Column: Info */}
              <div className="space-y-6 text-zinc-950 dark:text-zinc-50">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">General Information</h4>
                  <div className="grid gap-4 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500">Client</p>
                        <p className="text-sm font-medium">{invoice.client?.name || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500">Issued Date</p>
                        <p className="text-sm font-medium">{formatDate(invoice.issued_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500">Due Date</p>
                        <p className="text-sm font-medium">{formatDate(invoice.due_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-zinc-400" />
                      <div>
                        <p className="text-xs text-zinc-500">Total Amount</p>
                        <p className="text-sm font-medium font-mono">
                          {formatCurrency(invoice.total_amount, invoice.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Line Items</h4>
                  <div className="overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 text-left">
                        <tr>
                          <th className="px-3 py-2 font-medium">Description</th>
                          <th className="px-3 py-2 font-medium text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {invoice.line_items?.map((item) => (
                          <tr key={item.id}>
                            <td className="px-3 py-2">{item.description}</td>
                            <td className="px-3 py-2 text-right font-mono">
                              {formatCurrency(item.amount, invoice.currency)}
                            </td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={2} className="px-3 py-2 text-center text-zinc-500 italic">No items.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    variant={invoice.status === "paid" ? "outline" : "accent"}
                    onClick={() => updateStatus(invoice.status === "paid" ? "pending" : "paid")}
                    disabled={updating}
                  >
                    {invoice.status === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowReminder(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Remind
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                    onClick={deleteInvoice}
                    disabled={updating}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Reminder Logs */}
              <div className="space-y-6 text-zinc-950 dark:text-zinc-50">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Reminder History</h4>
                  <div className="space-y-3">
                    {!invoice.reminder_logs?.length ? (
                      <p className="text-sm text-zinc-500 italic py-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl text-center">
                        No reminders sent yet.
                      </p>
                    ) : (
                      invoice.reminder_logs.map((log) => (
                        <div key={log.id} className="flex gap-3 items-start p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                          <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                            <Mail className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">Reminder Sent</p>
                              <ToneBadge tone={log.tone} />
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">{formatDate(log.sent_at)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Upcoming Schedule</h4>
                  <div className="space-y-2">
                    {invoice.reminder_schedule?.filter(s => s.status === "pending").map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{formatDate(item.scheduled_for)}</span>
                        </div>
                        <ToneBadge tone={item.tone} />
                      </div>
                    ))}
                    {!invoice.reminder_schedule?.some(s => s.status === "pending") && (
                      <p className="text-xs text-zinc-500 italic">No pending reminders.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="sm:justify-start">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showReminder && invoice && (
        <SendReminderDialog 
          invoice={invoice} 
          onClose={() => {
            setShowReminder(false);
            fetchInvoice(); // Refresh logs after sending
          }} 
        />
      )}
    </>
  );
}
