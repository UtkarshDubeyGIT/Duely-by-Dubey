"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { UserNav } from "@/components/shared/UserNav";
import { MasterSearch } from "@/components/dashboard/MasterSearch";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  const pathname = usePathname();
  const title =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname.startsWith("/invoices")
      ? "Invoices"
      : pathname.startsWith("/clients")
      ? "Clients"
      : pathname.startsWith("/reminders")
      ? "Reminders"
      : "";

  return (
    <header className="flex h-16 md:h-20 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar px-3 md:px-6">
      {/* Sidebar trigger — visible on mobile when sidebar is hidden */}
      <SidebarTrigger className="shrink-0 h-8 w-8 md:hidden" />

      {/* Page title */}
      {title ? (
        <h1 className="shrink-0 truncate text-base font-bold text-sidebar-foreground md:text-2xl lg:text-3xl">
          {title}
        </h1>
      ) : null}

      {/* Search — grows to fill available space */}
      <div className="flex flex-1 min-w-0 items-center">
        <MasterSearch />
      </div>

      {/* Right action icons */}
      <div className="flex shrink-0 items-center gap-1 md:gap-3">
        <ModeToggle />
        <button
          className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <UserNav />
      </div>
    </header>
  );
}
