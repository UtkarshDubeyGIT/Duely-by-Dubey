"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { UserNav } from "@/components/shared/UserNav";
import { MasterSearch } from "@/components/dashboard/MasterSearch";

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
      <div className="flex flex-1 max-w-md items-center px-2 md:px-0">
        <MasterSearch />
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <UserNav />
      </div>
    </header>
  );
}
