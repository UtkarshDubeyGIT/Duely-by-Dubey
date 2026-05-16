"use client";

import { useState } from "react";
import type { Client } from "@/types";
import { ReliabilityBadge } from "@/components/ui/badge";
import { EditClientDialog } from "@/components/clients/EditClientDialog";
import { DeleteClientDialog } from "@/components/clients/DeleteClientDialog";
import { CreateClientDialog } from "@/components/clients/CreateClientDialog";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
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

export function ClientTable({ clients }: { clients: Client[] }) {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

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
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <p className="font-medium text-zinc-950 dark:text-zinc-50">{client.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{client.email}</p>
                  </TableCell>
                  <TableCell className="hidden text-zinc-600 dark:text-zinc-400 md:table-cell">{client.company}</TableCell>
                  <TableCell><ReliabilityBadge reliability={client.reliability_tag} /></TableCell>
                  <TableCell className="hidden text-right font-mono font-semibold text-zinc-950 dark:text-zinc-50 md:table-cell">{client.avg_days_late}</TableCell>
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
                        <DropdownMenuItem onClick={() => setEditingClient(client)}>
                          <div className="flex w-full items-center">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Client
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeletingClient(client)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
