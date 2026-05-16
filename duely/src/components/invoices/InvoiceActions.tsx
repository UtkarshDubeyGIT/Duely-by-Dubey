"use client";

import { useState } from "react";
import { CheckCircle, Clock, File, MoreHorizontal, Send, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/types";
import { SendReminderDialog } from "@/components/invoices/SendReminderDialog";

import { useRouter } from "next/navigation";

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete invoice", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={loading}>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowReminder(true)}>
            <Send className="mr-2 h-4 w-4" />
            Send Reminder
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={() => updateStatus("paid")}
            disabled={invoice.status === "paid"}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            Mark as Paid
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => updateStatus("pending")}
            disabled={invoice.status === "pending"}
          >
            <Clock className="mr-2 h-4 w-4 text-amber-600" />
            Mark as Pending
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => updateStatus("draft")}
            disabled={invoice.status === "draft"}
          >
            <File className="mr-2 h-4 w-4 text-zinc-600" />
            Mark as Draft
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={deleteInvoice} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showReminder && (
        <SendReminderDialog 
          invoice={invoice} 
          onClose={() => setShowReminder(false)} 
        />
      )}
    </>
  );
}
