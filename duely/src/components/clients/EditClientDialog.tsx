"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Client } from "@/types";

export function EditClientDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
    };

    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "Client could not be updated.");
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
          <button className="flex w-full items-center px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:bg-zinc-800 outline-none">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Client
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 pt-2">
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Name
            <input
              name="name"
              defaultValue={client.name}
              required
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
            <input
              name="email"
              type="email"
              defaultValue={client.email}
              required
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Company (Optional)
            <input
              name="company"
              defaultValue={client.company || ""}
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
