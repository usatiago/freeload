// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { NAV_ITEMS, isActivePath } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import Wordmark from "@/components/layout/Wordmark";

export default function SideNav() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const initial = (user?.full_name || user?.email || "A").trim().charAt(0).toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card/50 px-5 py-8 lg:flex">
      <Wordmark />

      <nav className="mt-12 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
          const active = isActivePath(pathname, to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                active
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4 transition-colors", active ? "text-primary" : "")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border pt-5">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
            isActivePath(pathname, "/settings")
              ? "bg-primary/10 font-medium text-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <div className="flex items-center gap-3 px-3 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">{user?.full_name || "Athlete"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}