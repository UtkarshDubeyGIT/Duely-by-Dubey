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
  ChevronRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge, ToneBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col gap-0 border-none shadow-2xl">
          {/* Header */}
          <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <ReceiptText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {invoice?.invoice_number || "Invoice Details"}
                  </DialogTitle>
                  <p className="text-sm text-zinc-500">{invoice?.client?.name || '...'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {invoice && <StatusBadge status={invoice.status} />}
                <Button variant="ghost" onClick={() => onOpenChange(false)} size="icon" className="rounded-full">
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 bg-white dark:bg-zinc-950">
            <div className="p-8 space-y-8">
              {loading ? (
                <div className="py-24 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-indigo-600 border-r-transparent" />
                  <p className="mt-4 text-xs font-medium text-zinc-400 uppercase tracking-widest">Loading</p>
                </div>
              ) : error ? (
                <div className="py-20 text-center">
                  <AlertCircle className="mx-auto h-10 w-10 text-red-500 opacity-50 mb-4" />
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">{error}</p>
                </div>
              ) : invoice ? (
                <>
                  {/* Primary Actions Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Management</CardTitle>
                      <CardDescription>Primary actions for this invoice.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                      <Button 
                        className="flex-1 h-10 font-bold" 
                        variant={invoice.status === "paid" ? "outline" : "accent"}
                        onClick={() => updateStatus(invoice.status === "paid" ? "pending" : "paid")}
                        disabled={updating}
                      >
                        {invoice.status === "paid" ? <Clock className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        {invoice.status === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 h-10 font-bold"
                        onClick={() => setShowReminder(true)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Reminder
                      </Button>
                      <Button 
                        variant="destructive"
                        className="flex-1 h-10 font-bold"
                        onClick={() => setShowDelete(true)}
                        disabled={updating}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Line Items Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Line Items</CardTitle>
                      <CardDescription>Breakdown of charges.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-hidden">
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {invoice.line_items?.map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 font-medium">{item.description}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold">{formatCurrency(item.amount, invoice.currency)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-zinc-50 dark:bg-zinc-900 font-bold">
                              <tr>
                                  <td className="px-6 py-4 text-zinc-500 uppercase text-xs tracking-wider">Total</td>
                                  <td className="px-6 py-4 text-right font-mono text-lg text-indigo-600 dark:text-indigo-400">{formatCurrency(invoice.total_amount, invoice.currency)}</td>
                              </tr>
                          </tfoot>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Log Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Activity & Schedule</CardTitle>
                      <CardDescription>History of sent reminders and upcoming schedule.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Communication History</h4>
                        {!invoice.reminder_logs?.length ? (
                          <p className="text-sm text-zinc-500 italic py-4 text-center">No reminders sent yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {invoice.reminder_logs.map((log) => (
                              <div key={log.id} className="flex gap-4 items-center">
                                <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                  <Mail className="h-4 w-4 text-zinc-500" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Reminder Sent <span className="text-zinc-500">on {formatDate(log.sent_at)}</span></p>
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
                              <div key={item.id} className="group flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-4 w-4 text-zinc-400" />
                                  <span className="text-xs font-semibold">{formatDate(item.scheduled_for)}</span>
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
                </>
              ) : null}
            </div>
          </ScrollArea>
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
