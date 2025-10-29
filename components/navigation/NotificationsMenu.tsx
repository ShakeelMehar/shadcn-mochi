"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    title: "Design sync at 3PM",
    description: "Check the latest Mochi-OS dashboard updates."
  },
  {
    id: 2,
    title: "New friend request",
    description: "Alex Chen wants to connect with you."
  },
  {
    id: 3,
    title: "Forum reply",
    description: "Jamie responded to your design system thread."
  }
];

export function NotificationsMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1">{notifications.length}</Badge>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-50 w-72 rounded-2xl border border-border bg-popover p-3 shadow-md3">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-xl bg-accent/30 p-3">
              <p className="text-sm font-semibold">{notification.title}</p>
              <p className="text-xs text-muted-foreground">{notification.description}</p>
            </div>
          ))}
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
