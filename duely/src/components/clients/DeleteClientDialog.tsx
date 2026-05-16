"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Client } from "@/types";

export function DeleteClientDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/clients/${client.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Client could not be deleted.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <>
      <button 
        className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 outline-none"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Client
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 sm:items-center sm:justify-center sm:p-4">
          <div className="w-full rounded-t-2xl bg-white dark:bg-zinc-950 sm:max-w-sm sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 p-5">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Delete Client</h3>
              <button className="rounded-lg p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:bg-zinc-800" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Are you sure you want to delete <strong>{client.name}</strong>? This action cannot be undone.
              </p>
              
              {error ? <p className="text-sm text-red-600 mt-4">{error}</p> : null}
              
              <div className="flex justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-5">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="button" variant="accent" className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500" onClick={onDelete} disabled={loading}>
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
