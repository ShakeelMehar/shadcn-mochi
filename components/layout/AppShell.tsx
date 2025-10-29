"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, SquarePen, Users2, LayoutDashboard, Newspaper } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { NotificationsMenu } from "@/components/navigation/NotificationsMenu";
import { ProfileMenu } from "@/components/navigation/ProfileMenu";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/chats", label: "Chats", icon: MessageCircle },
  { href: "/friends", label: "Friends", icon: Users2 },
  { href: "/forums", label: "Forums", icon: SquarePen },
  { href: "/feeds", label: "Feeds", icon: Newspaper }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside
        className={cn(
          "hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 p-6 backdrop-blur lg:flex",
          ""
        )}
      >
        <Link href="/overview" className="mb-8 flex items-center gap-2 text-xl font-semibold">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            🥮
          </span>
          Mochi-OS
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary shadow-md3"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <footer className="mt-8 text-xs text-muted-foreground">
          Mochi-OS v0.1.0
        </footer>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-lg font-semibold">Mochi-OS</span>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-lg font-semibold">Mochi-OS</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationsMenu />
            <ProfileMenu />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background px-4 py-6 scrollbar-thin">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
      {sidebarOpen ? (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-card p-6 shadow-md3">
            <nav className="flex flex-col gap-2">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => setSidebarOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
