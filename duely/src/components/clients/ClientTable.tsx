import type { Client } from "@/types";
import { ReliabilityBadge } from "@/components/ui/badge";
import { EditClientDialog } from "@/components/clients/EditClientDialog";
import { DeleteClientDialog } from "@/components/clients/DeleteClientDialog";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { MoreHorizontal } from "lucide-react";

export function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-950">Clients</h2>
          <p className="text-sm text-zinc-500">Reliability scores show who needs earlier follow-up.</p>
        </div>
        <CreateClientDialog />
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Name</th>
              <th className="hidden px-5 py-3 text-left font-medium md:table-cell">Company</th>
              <th className="px-5 py-3 text-left font-medium">Reliability</th>
              <th className="hidden px-5 py-3 text-right font-medium md:table-cell">Avg late</th>
              <th className="px-5 py-3 text-right font-medium">Invoices</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-950">{client.name}</p>
                  <p className="text-xs text-zinc-500">{client.email}</p>
                </td>
                <td className="hidden px-5 py-4 text-zinc-600 md:table-cell">{client.company}</td>
                <td className="px-5 py-4"><ReliabilityBadge reliability={client.reliability_tag} /></td>
                <td className="hidden px-5 py-4 text-right font-mono font-semibold text-zinc-950 md:table-cell">{client.avg_days_late}</td>
                <td className="px-5 py-4 text-right font-mono font-semibold text-zinc-950">{client.total_invoices}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <div className="group relative">
                      <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" aria-label="Client actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 top-full z-10 hidden w-48 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg group-hover:block group-focus-within:block">
                        <EditClientDialog client={client} />
                        <DeleteClientDialog client={client} />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
