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
  History,
  ListOrdered,
  Info
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge, ToneBadge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
          {/* Top Info Bar - More Padding */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 border-b">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 shrink-0">
                  <ReceiptText className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {invoice?.invoice_number || "Invoice"}
                  </DialogTitle>
                  <p className="text-zinc-500 text-sm font-medium tracking-wide">{invoice?.description || "Invoice details"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pr-10 shrink-0">
                {invoice && <StatusBadge status={invoice.status} />}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-zinc-950">
            {loading ? (
              <div className="py-32 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
                <p className="mt-6 text-sm font-medium text-zinc-400 tracking-widest uppercase">Loading Secure Data</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center p-10">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-6 opacity-30" />
                <p className="text-zinc-900 dark:text-zinc-50 font-bold text-lg">{error}</p>
                <Button variant="outline" className="mt-8 px-8" onClick={fetchInvoice}>Try again</Button>
              </div>
            ) : invoice ? (
              <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-8 border-b bg-zinc-50/30 dark:bg-zinc-900/10">
                  <TabsList className="h-14 bg-transparent gap-10 p-0">
                    <TabsTrigger 
                      value="overview" 
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-2 font-bold text-xs uppercase tracking-[0.1em]"
                    >
                      <Info className="h-4 w-4 mr-2.5" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="items"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-2 font-bold text-xs uppercase tracking-[0.1em]"
                    >
                      <ListOrdered className="h-4 w-4 mr-2.5" />
                      Line Items
                    </TabsTrigger>
                    <TabsTrigger 
                      value="activity"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-2 font-bold text-xs uppercase tracking-[0.1em]"
                    >
                      <History className="h-4 w-4 mr-2.5" />
                      Activity Log
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="m-0 h-full p-10 space-y-12 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Total Balance</p>
                        <p className="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tracking-tighter">
                          {formatCurrency(invoice.total_amount, invoice.currency)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Client</p>
                        <p className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">{invoice.client?.name}</p>
                        <p className="text-xs text-zinc-500 font-medium">{invoice.client?.email}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Due Date</p>
                        <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">{formatDate(invoice.due_date)}</p>
                        <p className="text-xs text-zinc-500 font-medium">Issued {formatDate(invoice.issued_date)}</p>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Management Actions</h4>
                      <div className="flex flex-wrap gap-5">
                        <Button 
                          className="flex-1 h-12 font-bold text-sm tracking-tight rounded-xl shadow-lg shadow-indigo-500/10" 
                          variant={invoice.status === "paid" ? "outline" : "accent"}
                          onClick={() => updateStatus(invoice.status === "paid" ? "pending" : "paid")}
                          disabled={updating}
                        >
                          {invoice.status === "paid" ? <Clock className="mr-2.5 h-4 w-4" /> : <CheckCircle2 className="mr-2.5 h-4 w-4" />}
                          {invoice.status === "paid" ? "Mark as Unpaid" : "Confirm as Paid"}
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 h-12 font-bold text-sm tracking-tight rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                          onClick={() => setShowReminder(true)}
                        >
                          <Send className="mr-2.5 h-4 w-4 text-indigo-500" />
                          Push Reminder
                        </Button>
                        <Button 
                          variant="destructive"
                          size="icon"
                          className="h-12 w-12 shrink-0 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30"
                          onClick={() => setShowDelete(true)}
                          disabled={updating}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/5 border border-indigo-100/50 dark:border-indigo-900/20">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-indigo-100 dark:border-indigo-800">
                          <Info className="h-3.5 w-3.5 text-indigo-500" />
                        </div>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          This invoice is currently <strong>{invoice.status}</strong>. 
                          {invoice.status === "paid" 
                            ? " All automated follow-ups have been disabled for this record." 
                            : " The smart scheduling engine will continue to monitor this balance and trigger nudges based on the activity timeline."}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Items Tab */}
                  <TabsContent value="items" className="m-0 h-full overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1">
                      <div className="p-10">
                        <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
                          <table className="w-full text-sm">
                            <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-400">
                              <tr>
                                <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-[0.15em]">Description</th>
                                <th className="px-6 py-4 text-right font-bold text-[10px] uppercase tracking-[0.15em]">Line Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                              {invoice.line_items?.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                                  <td className="px-6 py-6 font-semibold text-zinc-900 dark:text-zinc-50">{item.description}</td>
                                  <td className="px-6 py-6 text-right font-mono font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(item.amount, invoice.currency)}</td>
                                </tr>
                              ))}
                              {(!invoice.line_items || invoice.line_items.length === 0) && (
                                <tr>
                                  <td colSpan={2} className="px-6 py-12 text-center text-zinc-400 italic font-medium">No items found in this statement.</td>
                                </tr>
                              )}
                            </tbody>
                            <tfoot className="bg-zinc-50/30 dark:bg-zinc-900/20 font-bold">
                                <tr>
                                    <td className="px-6 py-5 text-zinc-500 uppercase text-[10px] tracking-widest">Total Statement Balance</td>
                                    <td className="px-6 py-5 text-right font-mono text-lg text-indigo-600 dark:text-indigo-400">{formatCurrency(invoice.total_amount, invoice.currency)}</td>
                                </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="m-0 h-full overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1">
                      <div className="p-10 space-y-12">
                        <div>
                          <div className="flex items-center justify-between mb-6 px-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Communication History</h4>
                            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{invoice.reminder_logs?.length || 0} Events</span>
                          </div>
                          {!invoice.reminder_logs?.length ? (
                            <div className="text-center py-12 bg-zinc-50/30 dark:bg-zinc-900/10 rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-800">
                                <Mail className="mx-auto h-8 w-8 text-zinc-200 dark:text-zinc-800 mb-3" />
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">No reminders dispatched</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {invoice.reminder_logs.map((log) => (
                                <div key={log.id} className="flex gap-5 items-center p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all">
                                  <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-800/30">
                                    <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4">
                                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Manual Reminder Sent</p>
                                      <ToneBadge tone={log.tone} />
                                    </div>
                                    <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">{formatDate(log.sent_at)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <Separator className="opacity-50" />

                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6 px-1">Upcoming Engine Schedule</h4>
                          <div className="space-y-3">
                            {invoice.reminder_schedule?.filter(s => s.status === "pending").map((item) => (
                              <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 shadow-sm text-zinc-400 group-hover:text-indigo-500 transition-colors border border-zinc-100 dark:border-zinc-700">
                                    <Calendar className="h-4 w-4" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Auto-generated nudge</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{formatDate(item.scheduled_for)}</p>
                                  </div>
                                </div>
                                <ToneBadge tone={item.tone} />
                              </div>
                            ))}
                            {!invoice.reminder_schedule?.some(s => s.status === "pending") && (
                              <div className="p-8 text-center rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-800">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] italic">Queue Empty</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            ) : null}
          </div>

          <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 border-t flex items-center justify-between">
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.25em] pl-2 hidden sm:block italic">Verified Duely System View</p>
            <Button variant="ghost" className="font-bold tracking-tight text-xs uppercase h-10 px-8 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800" onClick={() => onOpenChange(false)}>
              Close Portal
            </Button>
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
