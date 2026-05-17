import { Suspense } from "react";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { InvoiceTableSkeleton } from "@/components/shared/LoadingStates";
import { getClients, getInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  const [invoices, clients] = await Promise.all([getInvoices(), getClients()]);
  return (
    <Suspense fallback={<InvoiceTableSkeleton />}>
      <InvoiceTable invoices={invoices} clients={clients} />
    </Suspense>
  );
}
