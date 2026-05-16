"use client";

import { useEffect, useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

export function UserNav() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
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
    const response = await fetch("/api/auth/signout", {
      method: "POST",
    });
    if (response.ok) {
      window.location.href = "/login";
    }
  };

  const displayName = user?.name || "Dubey Studio";
  const displayEmail = user?.email || "demo@duely.tech";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="relative h-9 w-9 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <Avatar className="h-9 w-9 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
