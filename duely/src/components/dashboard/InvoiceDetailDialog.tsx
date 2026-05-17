"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Mail, 
  Send, 
  Calendar, 
  AlertCircle,
  Trash2,
  ReceiptText,
  Clock,
  CheckCircle2,
  Info,
  ChevronRight,
  ListOrdered,
  History
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge, ToneBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { SendReminderDialog } from "@/components/invoices/SendReminderDialog";
import { DeleteInvoiceDialog } from "@/components/invoices/DeleteInvoiceDialog";
import { InvoiceDetailSkeleton } from "@/components/shared/LoadingStates";

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
        <DialogContent className="flex max-h-[92dvh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden border-none p-0 shadow-2xl sm:w-[calc(100vw-2rem)] sm:max-w-5xl">
          {/* Header */}
          <div className="shrink-0 border-b border-zinc-200 bg-zinc-50 px-5 py-5 pr-12 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8 sm:py-6">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                  <ReceiptText className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="break-words text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                    {invoice?.invoice_number || "Invoice Details"}
                  </DialogTitle>
                  <p className="mt-1 truncate text-sm font-medium text-zinc-500">{invoice?.client?.name || '...'}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center">
                {invoice && <StatusBadge status={invoice.status} />}
              </div>
            </div>
          </div>
          
          <div className="min-h-0 flex-1 overflow-y-auto bg-white dark:bg-zinc-950">
            <div className="p-4 sm:p-6 lg:p-8">
              {loading ? (
                <InvoiceDetailSkeleton />
              ) : error ? (
                <div className="py-20 text-center">
                  <AlertCircle className="mx-auto h-10 w-10 text-red-500 opacity-50 mb-4" />
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">{error}</p>
                </div>
              ) : invoice ? (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] xl:gap-6">
                  {/* Left Column */}
                  <div className="min-w-0 space-y-5">
                    <Card className="border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <CardHeader className="px-5 sm:px-6">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Info className="h-4 w-4 text-zinc-400"/>
                          Invoice Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 sm:px-6">
                        <div className="min-w-0 space-y-1 rounded-lg border border-zinc-200/70 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:col-span-2">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</p>
                          <p className="break-words font-mono text-2xl font-bold leading-tight text-indigo-600 dark:text-indigo-400 sm:text-3xl">
                            {formatCurrency(invoice.total_amount, invoice.currency)}
                          </p>
                        </div>
                        <div className="min-w-0 space-y-1 rounded-lg border border-zinc-200/70 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Due Date</p>
                          <p className="text-base font-semibold leading-snug text-zinc-800 dark:text-zinc-200">{formatDate(invoice.due_date)}</p>
                        </div>
                        <div className="min-w-0 space-y-1 rounded-lg border border-zinc-200/70 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client</p>
                          <p className="break-words text-base font-semibold leading-snug text-zinc-800 dark:text-zinc-200">{invoice.client?.name}</p>
                        </div>
                        <div className="min-w-0 space-y-1 rounded-lg border border-zinc-200/70 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Issued On</p>
                          <p className="text-base font-semibold leading-snug text-zinc-800 dark:text-zinc-200">{formatDate(invoice.issued_date)}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="px-5 sm:px-6">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ListOrdered className="h-4 w-4 text-zinc-400" />
                          Line Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-hidden">
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                              {invoice.line_items?.map((item) => (
                                <tr key={item.id}>
                                  <td className="min-w-0 px-5 py-4 font-semibold text-zinc-800 dark:text-zinc-200 sm:px-6">
                                    <span className="block break-words">{item.description}</span>
                                  </td>
                                  <td className="whitespace-nowrap px-5 py-4 text-right font-mono font-bold text-zinc-800 dark:text-zinc-200 sm:px-6">{formatCurrency(item.amount, invoice.currency)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                     <Card className="border-indigo-500/10 bg-indigo-50/20 dark:border-indigo-500/20 dark:bg-indigo-950/10">
                      <CardHeader className="px-5 sm:px-6">
                        <CardTitle className="text-base">Management Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-3 px-5 sm:grid-cols-3 sm:px-6">
                        <Button 
                          className="h-11 w-full font-bold" 
                          variant={invoice.status === "paid" ? "outline" : "accent"}
                          onClick={() => updateStatus(invoice.status === "paid" ? "pending" : "paid")}
                          disabled={updating}
                        >
                          {invoice.status === "paid" ? <Clock className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                          {invoice.status === "paid" ? "Mark Unpaid" : "Mark Paid"}
                        </Button>
                        <Button 
                          variant="outline"
                          className="h-11 w-full bg-white font-bold dark:bg-zinc-900"
                          onClick={() => setShowReminder(true)}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Remind
                        </Button>
                        <Button 
                          variant="destructive"
                          className="h-11 w-full font-bold"
                          onClick={() => setShowDelete(true)}
                          disabled={updating}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Right Column */}
                  <div className="min-w-0">
                    <Card>
                      <CardHeader className="px-5 sm:px-6">
                        <CardTitle className="text-base flex items-center gap-2">
                          <History className="h-4 w-4 text-zinc-400" />
                          Activity Log
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 px-5 sm:px-6">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Communication History</h4>
                          {!invoice.reminder_logs?.length ? (
                            <p className="text-sm text-zinc-500 italic py-4 text-center">No reminders sent yet.</p>
                          ) : (
                            <div className="space-y-4">
                              {invoice.reminder_logs.map((log) => (
                                <div key={log.id} className="flex min-w-0 flex-col gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/50 sm:flex-row sm:items-center">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <Mail className="h-4 w-4 text-zinc-500" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-200">Reminder Sent <span className="text-zinc-500">on {formatDate(log.sent_at)}</span></p>
                                  </div>
                                  <ToneBadge tone={log.tone} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Separator />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Upcoming Schedule</h4>
                          {!invoice.reminder_schedule?.some(s => s.status === "pending") ? (
                            <p className="text-sm text-zinc-500 italic py-4 text-center">No pending reminders.</p>
                          ) : (
                            <div className="space-y-3">
                              {invoice.reminder_schedule?.filter(s => s.status === "pending").map((item) => (
                                <div key={item.id} className="group flex min-w-0 flex-col gap-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Calendar className="h-4 w-4 text-zinc-400" />
                                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{formatDate(item.scheduled_for)}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <ToneBadge tone={item.tone} />
                                    <ChevronRight className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
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
