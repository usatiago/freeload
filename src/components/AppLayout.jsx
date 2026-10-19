// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import SideNav from "@/components/layout/SideNav";
import TabBar from "@/components/layout/TabBar";
import Wordmark from "@/components/layout/Wordmark";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <SideNav />

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur-md lg:hidden">
        <Wordmark />
        <Link
          to="/settings"
          aria-label="Settings"
          className="-mr-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-3xl px-5 pb-32 pt-6 lg:px-10 lg:pb-20 lg:pt-12">
          {children}
        </div>
      </main>

      <TabBar />
    </div>
  );
}