"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { getInitials } from "@/lib/utils";
import { ModeToggle } from "@/components/shared/ModeToggle";

export function TopBar() {
  const pathname = usePathname();
  const title = pathname === "/dashboard" ? "Dashboard" : "";

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {title ? (
          <h1 className="text-xl font-bold text-sidebar-foreground leading-8 md:text-3xl md:leading-[52px]">
            {title}
          </h1>
        ) : null}
      </div>
      <div className="hidden w-full max-w-md items-center gap-2 rounded-lg border border-sidebar-border bg-background px-3 py-2 md:flex">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          className="w-full border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Search"
        />
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
          {getInitials("Dubey Studio")}
        </div>
      </div>
    </header>
  );
}
