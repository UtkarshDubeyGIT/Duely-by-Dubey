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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
          {/* Top Info Bar */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 border-b">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <ReceiptText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold tracking-tight">
                    {invoice?.invoice_number || "Invoice"}
                  </DialogTitle>
                  <p className="text-zinc-500 text-xs font-medium">{invoice?.description || "Invoice details"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pr-8">
                {invoice && <StatusBadge status={invoice.status} />}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-zinc-950">
            {loading ? (
              <div className="py-24 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-indigo-600 border-r-transparent" />
                <p className="mt-4 text-xs font-medium text-zinc-500">Loading details...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center p-6">
                <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-4 opacity-50" />
                <p className="text-zinc-900 dark:text-zinc-50 font-semibold">{error}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={fetchInvoice}>Try again</Button>
              </div>
            ) : invoice ? (
              <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 border-b bg-zinc-50/50 dark:bg-zinc-900/20">
                  <TabsList className="h-12 bg-transparent gap-6 p-0">
                    <TabsTrigger 
                      value="overview" 
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-1"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="items"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-1"
                    >
                      <ListOrdered className="h-4 w-4 mr-2" />
                      Line Items
                    </TabsTrigger>
                    <TabsTrigger 
                      value="activity"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-1"
                    >
                      <History className="h-4 w-4 mr-2" />
                      Activity
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="m-0 h-full p-6 space-y-8 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Amount</p>
                        <p className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(invoice.total_amount, invoice.currency)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Client</p>
                        <p className="text-sm font-semibold truncate">{invoice.client?.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Due Date</p>
                        <p className="text-sm font-semibold">{formatDate(invoice.due_date)}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Primary Actions</h4>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          className="flex-1 h-10 font-bold" 
                          variant={invoice.status === "paid" ? "outline" : "accent"}
                          onClick={() => updateStatus(invoice.status === "paid" ? "pending" : "paid")}
                          disabled={updating}
                        >
                          {invoice.status === "paid" ? <Clock className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                          {invoice.status === "paid" ? "Unmark as Paid" : "Mark as Paid"}
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 h-10 font-bold"
                          onClick={() => setShowReminder(true)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Remind
                        </Button>
                        <Button 
                          variant="destructive"
                          size="icon"
                          className="h-10 w-10 shrink-0"
                          onClick={() => setShowDelete(true)}
                          disabled={updating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 leading-relaxed">
                        This invoice is currently in <strong>{invoice.status}</strong> status. Automated reminders will 
                        {invoice.status === "paid" ? " no longer " : " continue to "} fire based on the schedule.
                      </p>
                    </div>
                  </TabsContent>

                  {/* Items Tab */}
                  <TabsContent value="items" className="m-0 h-full overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1">
                      <div className="p-6">
                        <div className="overflow-hidden rounded-xl border">
                          <table className="w-full text-sm">
                            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                              <tr>
                                <th className="px-4 py-3 text-left font-bold text-[10px] uppercase tracking-widest">Description</th>
                                <th className="px-4 py-3 text-right font-bold text-[10px] uppercase tracking-widest">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {invoice.line_items?.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-4 font-medium text-zinc-900 dark:text-zinc-50">{item.description}</td>
                                  <td className="px-4 py-4 text-right font-mono font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(item.amount, invoice.currency)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="m-0 h-full overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1">
                      <div className="p-6 space-y-8">
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 px-1">Reminder History</h4>
                          {!invoice.reminder_logs?.length ? (
                            <p className="text-sm text-zinc-500 italic py-6 text-center border-2 border-dashed rounded-xl">No reminders sent yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {invoice.reminder_logs.map((log) => (
                                <div key={log.id} className="flex gap-4 items-center p-3 rounded-xl border bg-white dark:bg-zinc-900/50">
                                  <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-800/30">
                                    <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Reminder Sent</p>
                                      <ToneBadge tone={log.tone} />
                                    </div>
                                    <p className="text-[10px] font-bold text-zinc-400">{formatDate(log.sent_at)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 px-1">Smart Schedule</h4>
                          <div className="space-y-2">
                            {invoice.reminder_schedule?.filter(s => s.status === "pending").map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{formatDate(item.scheduled_for)}</span>
                                </div>
                                <ToneBadge tone={item.tone} />
                              </div>
                            ))}
                            {!invoice.reminder_schedule?.some(s => s.status === "pending") && (
                              <p className="text-xs text-zinc-500 italic py-4 text-center border rounded-xl">No pending reminders.</p>
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

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t flex justify-end">
            <Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase tracking-widest" onClick={() => onOpenChange(false)}>
              Close
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
