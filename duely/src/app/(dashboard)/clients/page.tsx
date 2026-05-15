import { ClientTable } from "@/components/clients/ClientTable";
import { getClients } from "@/lib/data";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientTable clients={clients} />;
}
