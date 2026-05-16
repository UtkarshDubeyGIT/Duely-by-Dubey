"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function CreateClientDialog() {
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
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "Client could not be created.");
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
          <Button variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Client</DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 pt-2">
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Name
            <input
              name="name"
              required
              placeholder="John Doe"
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 text-sm outline-none focus:border-indigo-500"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Company (Optional)
            <input
              name="company"
              placeholder="Acme Inc."
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
              {loading ? "Creating..." : "Create client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
