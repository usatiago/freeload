// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Link, useLocation } from "@tanstack/react-router";
import { NAV_ITEMS, isActivePath } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export default function TabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
          const active = isActivePath(pathname, to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform duration-200", active ? "scale-110" : "")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}