"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Client } from "@/types";

export function DeleteClientDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setLoading(true);
    setError(null);

    try {
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
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 outline-none">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Client
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{client.name}</strong>?
            This action cannot be undone and will remove all associated invoices.
          </DialogDescription>
        </DialogHeader>

        {error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
            onClick={onDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
