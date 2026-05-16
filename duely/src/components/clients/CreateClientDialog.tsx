"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  }

  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Client
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 sm:items-center sm:justify-center sm:p-4">
          <div className="w-full rounded-t-2xl bg-white sm:max-w-md sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 p-5">
              <h3 className="text-lg font-semibold text-zinc-950">Create Client</h3>
              <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form action={onSubmit} className="grid gap-4 p-5">
              <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                Name
                <input name="name" required placeholder="John Doe" className="h-9 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-500" />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                Email
                <input name="email" type="email" required placeholder="john@example.com" className="h-9 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-500" />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
                Company (Optional)
                <input name="company" placeholder="Acme Inc." className="h-9 rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-indigo-500" />
              </label>
              
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              
              <div className="flex justify-end gap-2 border-t border-zinc-200 pt-4 mt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="accent" disabled={loading}>{loading ? "Creating..." : "Create client"}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
