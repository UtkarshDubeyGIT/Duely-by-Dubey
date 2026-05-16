"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/invoices": "Invoices",
  "/clients": "Clients",
  "/reminders": "Reminders",
};

export function TopBar() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2 md:hidden" />
        <h1 className="text-2xl font-bold text-zinc-950">{title}</h1>
      </div>
      <div className="hidden w-full max-w-md items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 md:flex">
        <Search className="h-4 w-4 text-zinc-400" />
        <input className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-zinc-400" placeholder="Search invoices, clients, reminders" />
      </div>
      <div className="flex items-center gap-3">
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white">
          {getInitials("Dubey Studio")}
        </div>
      </div>
    </header>
  );
}
