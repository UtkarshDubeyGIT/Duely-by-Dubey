"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, FileText, LayoutDashboard, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/smart", label: "Smart", icon: Sparkles },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/reminders", label: "Reminders", icon: Bell },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 md:hidden">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2",
              active
                ? "text-indigo-600"
                : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[11px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
