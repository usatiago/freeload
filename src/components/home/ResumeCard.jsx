// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import SessionTimer from "@/components/session/SessionTimer";

/** A workout that was started but not finished — one tap back into it. */
export default function ResumeCard({ session }) {
  return (
    <Link
      to="/sessions/$sessionId"
      params={{ sessionId: session.id }}
      className="panel group mb-4 flex items-center gap-4 border-primary/30 bg-primary/[0.06] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift animate-fade-up"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Play className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="label-micro block">Workout in progress</span>
        <span className="mt-0.5 block truncate font-display text-base font-semibold tracking-tight">
          {session.name}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-xs font-medium text-primary">
        <SessionTimer startedAt={session.started_at} />
        <span className="hidden sm:inline">Resume</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}