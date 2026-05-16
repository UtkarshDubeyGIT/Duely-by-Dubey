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
  ReceiptText,
  Clock,
  CheckCircle2,
  FileText,
  ChevronRight
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
import { DeleteInvoiceDialog } from "@/components/invoices/DeleteInvoiceDialog";

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
  const [showDelete, setShowDelete] = useState(false);
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
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDelete(false);
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
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
          {/* Header Section */}
          <div className="bg-zinc-950 p-6 text-white shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <ReceiptText className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    {invoice?.invoice_number || "Invoice"}
                  </DialogTitle>
                  <p className="text-zinc-400 text-sm font-medium mt-0.5">{invoice?.description || "Loading description..."}</p>
                </div>
              </div>
              <div className="pr-8">
                {invoice && <StatusBadge status={invoice.status} />}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-zinc-950">
            {loading ? (
              <div className="py-24 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
                <p className="mt-4 text-sm font-medium text-zinc-500">Retrieving secure data...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4 opacity-50" />
                <p className="text-zinc-900 dark:text-zinc-50 font-semibold">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={fetchInvoice}>Try again</Button>
              </div>
            ) : invoice ? (
              <div className="grid gap-10 lg:grid-cols-5">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-50">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Client</p>
                      <p className="text-sm font-bold truncate">{invoice.client?.name}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Due Date</p>
                      <p className="text-sm font-bold">{formatDate(invoice.due_date)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Items</p>
                      <p className="text-sm font-bold">{invoice.line_items?.length || 0}</p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-3 p-2 rounded-2xl bg-indigo-50/30 dark:bg-indigo-900/5 border border-indigo-100/50 dark:border-indigo-900/20">
                    <Button 
                      className="flex-1 h-11 font-bold rounded-xl shadow-lg shadow-indigo-500/10" 
                      variant={invoice.status === "paid" ? "outline" : "accent"}
                      onClick={() => updateStatus(invoice.status === "paid" ? "pending" : "paid")}
                      disabled={updating}
                    >
                      {invoice.status === "paid" ? <Clock className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {invoice.status === "paid" ? "Revert to Unpaid" : "Mark as Fully Paid"}
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-11 px-6 font-bold rounded-xl bg-white dark:bg-zinc-900"
                      onClick={() => setShowReminder(true)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Remind
                    </Button>
                    <Button 
                      variant="destructive"
                      size="icon"
                      className="h-11 w-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400"
                      onClick={() => setShowDelete(true)}
                      disabled={updating}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Items Table */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 px-1">Detailed Breakdown</h4>
                    <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm bg-zinc-50/10 dark:bg-zinc-900/5">
                      <table className="w-full text-sm text-zinc-900 dark:text-zinc-50">
                        <thead>
                          <tr className="bg-zinc-100/50 dark:bg-zinc-900/50">
                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400">Description</th>
                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-zinc-400">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {invoice.line_items?.map((item) => (
                            <tr key={item.id}>
                              <td className="px-5 py-4 font-medium">{item.description}</td>
                              <td className="px-5 py-4 text-right font-mono font-bold">{formatCurrency(item.amount, invoice.currency)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Sidebar area: Reminders & Schedule */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Timeline section */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-5 px-1">Activity Log</h4>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-100 dark:before:bg-zinc-800">
                      {!invoice.reminder_logs?.length ? (
                        <div className="text-center py-6 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-800">
                          <p className="text-xs text-zinc-400 font-medium italic">No activity recorded</p>
                        </div>
                      ) : (
                        invoice.reminder_logs.map((log) => (
                          <div key={log.id} className="relative">
                            <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-indigo-500 border-2 border-white dark:border-zinc-950 shadow-sm" />
                            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Reminder Sent</p>
                                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{formatDate(log.sent_at)}</p>
                              </div>
                              <ToneBadge tone={log.tone} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Upcoming section */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 px-1">Smart Schedule</h4>
                    <div className="space-y-2 p-1">
                      {invoice.reminder_schedule?.filter(s => s.status === "pending").map((item) => (
                        <div key={item.id} className="group flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-transparent hover:border-indigo-500/20 transition-all cursor-default">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm text-zinc-400 group-hover:text-indigo-500 transition-colors">
                              <Calendar className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{formatDate(item.scheduled_for)}</span>
                          </div>
                          <ToneBadge tone={item.tone} />
                        </div>
                      ))}
                      {!invoice.reminder_schedule?.some(s => s.status === "pending") && (
                        <div className="p-4 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No pending runs</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between sm:justify-between">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em] hidden sm:block">Duely Secure View v1.2</p>
            <Button variant="ghost" className="font-bold tracking-tight h-9 rounded-lg" onClick={() => onOpenChange(false)}>
              Dismiss Details
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

      <DeleteInvoiceDialog
        invoiceNumber={invoice?.invoice_number || ""}
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={deleteInvoice}
        loading={updating}
      />
    </>
  );
}
