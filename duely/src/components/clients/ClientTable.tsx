"use client";

import { useMemo, useState } from "react";
import type { Client, Invoice } from "@/types";
import { ReliabilityBadge } from "@/components/ui/badge";
import { EditClientDialog } from "@/components/clients/EditClientDialog";
import { DeleteClientDialog } from "@/components/clients/DeleteClientDialog";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { ClientPaymentHistory } from "@/components/clients/ClientPaymentHistory";
import { analyzeClientReliability } from "@/lib/reliability";
import { ChevronDown, ChevronRight, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ClientTable({ clients, invoices }: { clients: Client[]; invoices: Invoice[] }) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  // Build per-client invoice map
  const invoicesByClient = useMemo(() => {
    const map = new Map<string, Invoice[]>();
    for (const inv of invoices) {
      const list = map.get(inv.client_id) ?? [];
      list.push(inv);
      map.set(inv.client_id, list);
    }
    return map;
  }, [invoices]);

  // Compute reliability analysis per client (derived from real data)
  const analysisMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof analyzeClientReliability>>();
    for (const client of clients) {
      const clientInvoices = invoicesByClient.get(client.id) ?? [];
      map.set(client.id, analyzeClientReliability(clientInvoices));
    }
    return map;
  }, [clients, invoicesByClient]);

  function toggleExpand(clientId: string) {
    setExpandedClientId((prev) => (prev === clientId ? null : clientId));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">Clients</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Reliability scores show who needs earlier follow-up.</p>
        </div>
        <CreateClientDialog />
      </div>

      {/* Global Dialogs (outside the menu hierarchy) */}
      {editingClient && (
        <EditClientDialog
          client={editingClient}
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
        />
      )}
      {deletingClient && (
        <DeleteClientDialog
          client={deletingClient}
          open={!!deletingClient}
          onOpenChange={(open) => !open && setDeletingClient(null)}
        />
      )}

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead>Reliability</TableHead>
              <TableHead className="hidden text-right md:table-cell">Avg late</TableHead>
              <TableHead className="text-right">Invoices</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => {
                const analysis = analysisMap.get(client.id);
                const isExpanded = expandedClientId === client.id;
                // Use computed tag if available, otherwise fall back to stored tag
                const displayTag = analysis?.tag ?? client.reliability_tag;
                const displayAvgLate = analysis?.avgDaysLate ?? client.avg_days_late;

                return (
                  <>
                    <TableRow
                      key={client.id}
                      className={`cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${isExpanded ? "bg-zinc-50 dark:bg-zinc-900/50" : ""}`}
                      onClick={() => toggleExpand(client.id)}
                    >
                      <TableCell className="w-8 pr-0">
                        <button
                          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(client.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-zinc-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-zinc-500" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-zinc-950 dark:text-zinc-50">{client.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{client.email}</p>
                      </TableCell>
                      <TableCell className="hidden text-zinc-600 dark:text-zinc-400 md:table-cell">{client.company}</TableCell>
                      <TableCell><ReliabilityBadge reliability={displayTag} /></TableCell>
                      <TableCell className="hidden text-right font-mono font-semibold text-zinc-950 dark:text-zinc-50 md:table-cell">{displayAvgLate}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-zinc-950 dark:text-zinc-50">{client.total_invoices}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
                          >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingClient(client); }}>
                              <div className="flex w-full items-center">
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Client
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => { e.stopPropagation(); setDeletingClient(client); }}
                              className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
                            >
                              <div className="flex w-full items-center">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Client
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Payment History Row */}
                    {isExpanded && analysis && (
                      <TableRow key={`${client.id}-history`} className="hover:bg-transparent">
                        <TableCell colSpan={7} className="p-0">
                          <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 sm:p-6 animate-in slide-in-from-top-2 duration-200">
                            <ClientPaymentHistory analysis={analysis} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
