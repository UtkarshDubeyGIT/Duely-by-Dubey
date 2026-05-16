import { Suspense } from "react";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { getClients, getInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  const [invoices, clients] = await Promise.all([getInvoices(), getClients()]);
  return (
    <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />}>
      <InvoiceTable invoices={invoices} clients={clients} />
    </Suspense>
  );
}
