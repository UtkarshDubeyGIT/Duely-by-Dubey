import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { getClients, getInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  const [invoices, clients] = await Promise.all([getInvoices(), getClients()]);
  return <InvoiceTable invoices={invoices} clients={clients} />;
}
