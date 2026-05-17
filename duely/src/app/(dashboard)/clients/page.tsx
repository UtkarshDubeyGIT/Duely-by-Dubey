import { ClientTable } from "@/components/clients/ClientTable";
import { getClients, getInvoices } from "@/lib/data";

export default async function ClientsPage() {
  const [clients, invoices] = await Promise.all([getClients(), getInvoices()]);
  return <ClientTable clients={clients} invoices={invoices} />;
}
