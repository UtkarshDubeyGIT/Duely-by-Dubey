"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Mail, 
  Send, 
  Calendar, 
  User, 
  DollarSign,
  AlertCircle,
  Trash2,
  ReceiptText
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
    if (!confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) return;
    
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onOpenChange(false);
        router.refresh();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to delete invoice");
      }
    } catch (err) {
      console.error("Failed to delete invoice", err);
      alert("An error occurred while trying to delete the invoice.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:p-6 p-4">
          <DialogHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pr-8">
              <div className="flex items-center gap-3 text-zinc-950 dark:text-zinc-50">
                <ReceiptText className="h-5 w-5 text-indigo-600" />
                <DialogTitle className="text-xl font-mono font-bold tracking-tight">
                  {invoice?.invoice_number || "Invoice Details"}
                </DialogTitle>
                {invoice && <StatusBadge status={invoice.status} />}
              </div>
            </div>
          </DialogHeader>

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]" />
              <p className="mt-4 text-sm font-medium text-zinc-500">Loading invoice details...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600 bg-red-50 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-900/20">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-80" />
              <p className="font-medium">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchInvoice}>Try again</Button>
            </div>
          ) : invoice ? (
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Left Side: Main Info (3 columns) */}
              <div className="lg:col-span-3 space-y-8 text-zinc-950 dark:text-zinc-50">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">General Information</h4>
                  <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                        <User className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Client</p>
                        <p className="text-sm font-semibold">{invoice.client?.name || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                        <DollarSign className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Amount</p>
                        <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(invoice.total_amount, invoice.currency)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                        <Calendar className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Issued Date</p>
                        <p className="text-sm font-semibold">{formatDate(invoice.issued_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                        <Calendar className="h-4 w-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Due Date</p>
                        <p className="text-sm font-semibold">{formatDate(invoice.due_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Line Items</h4>
                  <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 text-left">
                        <tr>
                          <th className="px-4 py-2.5 font-bold text-[11px] uppercase tracking-wider">Description</th>
                          <th className="px-4 py-2.5 font-bold text-[11px] uppercase tracking-wider text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {invoice.line_items?.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                            <td className="px-4 py-3 font-medium">{item.description}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold">
                              {formatCurrency(item.amount, invoice.currency)}
                            </td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={2} className="px-4 py-8 text-center text-zinc-400 italic">No line items listed.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button 
                    className="flex-1 min-w-[140px] h-10 font-bold tracking-tight" 
                    variant={invoice.status === "paid" ? "outline" : "accent"}
                    onClick={() => updateStatus(invoice.status === "paid" ? "pending" : "paid")}
                    disabled={updating}
                  >
                    {invoice.status === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 min-w-[140px] h-10 font-bold tracking-tight"
                    onClick={() => setShowReminder(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Remind
                  </Button>
                  <Button 
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 shrink-0 border-none bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    onClick={deleteInvoice}
                    disabled={updating}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Right Side: Reminders (2 columns) */}
              <div className="lg:col-span-2 space-y-8 text-zinc-950 dark:text-zinc-50">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Reminder History</h4>
                  <div className="space-y-3">
                    {!invoice.reminder_logs?.length ? (
                      <div className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-800 text-zinc-400 bg-zinc-50/10">
                        <Mail className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs font-medium italic">No reminders sent yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                        {invoice.reminder_logs.map((log) => (
                          <div key={log.id} className="flex gap-3 items-center p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm transition-transform active:scale-[0.98]">
                            <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-800/30">
                              <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-bold tracking-tight">Reminder Sent</p>
                                <ToneBadge tone={log.tone} />
                              </div>
                              <p className="text-[11px] font-bold text-zinc-400 mt-0.5">{formatDate(log.sent_at)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4">Upcoming Schedule</h4>
                  <div className="space-y-2 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 bg-zinc-50/10">
                    {invoice.reminder_schedule?.filter(s => s.status === "pending").map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900/50 text-xs shadow-sm border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1 rounded-md bg-zinc-50 dark:bg-zinc-800">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                          </div>
                          <span className="font-semibold">{formatDate(item.scheduled_for)}</span>
                        </div>
                        <ToneBadge tone={item.tone} />
                      </div>
                    ))}
                    {!invoice.reminder_schedule?.some(s => s.status === "pending") && (
                      <div className="py-4 text-center">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider italic">No pending reminders</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button variant="ghost" className="font-bold tracking-tight" onClick={() => onOpenChange(false)}>
              Close Detail View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showReminder && invoice && (
        <SendReminderDialog 
          invoice={invoice} 
          onClose={() => {
            setShowReminder(false);
            fetchInvoice();
          }} 
        />
      )}
    </>
  );
}
