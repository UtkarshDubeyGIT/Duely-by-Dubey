"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Client } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateInvoiceDialog({ clients, nextInvoiceNumber }: { clients: Client[]; nextInvoiceNumber: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const amount = Number(formData.get("amount") || 0);
    const payload = {
      client_id: String(formData.get("client_id") || ""),
      invoice_number: String(formData.get("invoice_number") || nextInvoiceNumber),
      amount,
      currency: "INR",
      tax_rate: Number(formData.get("tax_rate") || 0),
      issued_date: String(formData.get("issued_date") || ""),
      due_date: String(formData.get("due_date") || ""),
      description: String(formData.get("description") || ""),
      notes: String(formData.get("notes") || ""),
      line_items: [
        {
          description: String(formData.get("description") || "Professional services"),
          qty: 1,
          price: amount,
          amount,
        },
      ],
    };

    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Invoice could not be created.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="accent">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        }
      />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create invoice</DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="invoice_number">Invoice number</Label>
              <Input id="invoice_number" name="invoice_number" defaultValue={nextInvoiceNumber} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_id">Client</Label>
              <Select name="client_id" required>
                <SelectTrigger id="client_id">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" min="1" step="0.01" required defaultValue="1200" className="font-mono" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tax_rate">Tax rate</Label>
              <Input id="tax_rate" name="tax_rate" type="number" min="0" max="100" step="0.01" defaultValue="0" className="font-mono" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="issued_date">Issued date</Label>
              <Input id="issued_date" name="issued_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due_date">Due date</Label>
              <Input id="due_date" name="due_date" type="date" required defaultValue="2026-05-29" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required defaultValue="Professional services" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea id="notes" name="notes" rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="accent" disabled={loading}>{loading ? "Creating..." : "Create invoice"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
