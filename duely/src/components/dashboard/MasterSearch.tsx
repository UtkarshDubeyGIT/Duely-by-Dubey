"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import type { Invoice } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { InvoiceDetailDialog } from "@/components/dashboard/InvoiceDetailDialog";

export function MasterSearch() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      fetch("/api/invoices")
        .then((res) => res.json())
        .then((data) => setInvoices(data.data || []));
    }
  }, [open]);

  const handleSelect = (id: string) => {
    // Wrap in setTimeout to let CMDK finish its event processing before we unmount it
    setTimeout(() => {
      setOpen(false);
      
      // Delay opening the detail dialog until the search dialog has started closing
      // to avoid focus management conflicts between Base UI dialogs.
      setTimeout(() => {
        setSelectedInvoiceId(id);
        setDetailOpen(true);
      }, 150);
    }, 0);
  };

  if (!mounted) return (
    <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-sidebar-border bg-background px-3 py-2 text-muted-foreground transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 min-w-0">
      <Search className="h-4 w-4 shrink-0" />
      <span className="text-sm truncate">Search invoices, clients...</span>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full max-w-md items-center gap-2 rounded-lg border border-sidebar-border bg-background px-3 py-2 text-muted-foreground transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 min-w-0"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="text-sm truncate">Search invoices, clients...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a client name, invoice #, or status..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Invoices">
            {invoices.map((invoice) => (
              <CommandItem
                key={invoice.id}
                value={`${invoice.invoice_number} ${invoice.client?.name} ${invoice.status} ${invoice.description} ${invoice.issued_date} ${invoice.total_amount}`}
                onSelect={() => handleSelect(invoice.id)}
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleSelect(invoice.id);
                }}
                className="flex items-center justify-between py-3 cursor-pointer"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono font-bold">{invoice.invoice_number}</span>
                  <span className="text-xs text-muted-foreground">
                    {invoice.client?.name} • {invoice.description}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {formatCurrency(invoice.total_amount, invoice.currency)}
                  </span>
                  <StatusBadge status={invoice.status} />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {selectedInvoiceId && (
        <InvoiceDetailDialog
          key={selectedInvoiceId}
          invoiceId={selectedInvoiceId}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}
    </>
  );
}
