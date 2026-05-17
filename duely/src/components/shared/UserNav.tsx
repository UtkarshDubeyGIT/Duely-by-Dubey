"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, LogOut, Settings, User } from "lucide-react";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

export function UserNav() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          email: user.email || "",
        });
      }
    });
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      window.location.replace("/login");
    }
  };

  if (!mounted) return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;

  const displayName = user?.name || "Dubey Studio";
  const displayEmail = user?.email || "demo@duely.tech";

  return (
    <>
      {isLoggingOut && (
        <div
          aria-live="polite"
          aria-busy="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 rounded-lg border border-border bg-popover px-5 py-4 text-popover-foreground shadow-lg">
            <LoaderCircle className="h-5 w-5 animate-spin text-indigo-500" />
            <span className="text-sm font-medium">Logging out...</span>
          </div>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              disabled={isLoggingOut}
            >
              {getInitials(displayName)}
            </button>
          }
        />
        <DropdownMenuContent className="w-56" align="end">
          <div className="px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {displayEmail}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {}}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isLoggingOut}
            onClick={handleLogout}
            variant="destructive"
          >
            {isLoggingOut ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
