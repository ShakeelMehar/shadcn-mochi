"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export function ProfileMenu() {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full bg-accent/60 px-2 py-1">
          <Avatar fallback={user?.email ?? ""} className="h-8 w-8" />
          <span className="hidden text-sm font-medium lg:block">{user?.email ?? "Guest"}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-50 w-56 rounded-2xl border border-border bg-popover p-2 shadow-md3">
        <div className="rounded-xl bg-accent/30 p-3 text-sm">
          <p className="font-semibold">{user?.email ?? "Guest"}</p>
          <p className="text-xs text-muted-foreground">Mochi-OS pilot program</p>
        </div>
        <DropdownMenu.Item asChild>
          <Link
            href="/overview"
            className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent"
          >
            <Settings className="h-4 w-4" /> Account settings
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/20"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
