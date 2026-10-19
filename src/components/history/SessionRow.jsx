// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatDateShort, formatDuration } from "@/lib/dates";
import { round1, weightUnit } from "@/lib/units";

export default function SessionRow({ session, units }) {
  const volume = units === "imperial" ? round1((session.total_volume || 0) * 2.20462262) : Math.round(session.total_volume || 0);

  return (
    <Link
      to="/sessions/$sessionId"
      params={{ sessionId: session.id }}
      className="panel group flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground">
        <CheckCircle2 className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-base font-semibold tracking-tight">
          {session.name || "Workout"}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {formatDateShort(session.started_at)} · {formatDuration(session.duration_seconds)} ·{" "}
          {session.total_sets || 0} set{session.total_sets === 1 ? "" : "s"}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="figure block text-sm font-semibold leading-none">{volume}</span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {weightUnit(units)} vol
        </span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}