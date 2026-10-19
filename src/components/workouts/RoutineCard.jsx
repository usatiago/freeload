// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Link } from "@tanstack/react-router";
import { ArrowRight, Dumbbell } from "lucide-react";

export default function RoutineCard({ routine, highlight = false }) {
  const count = (routine.exercises || []).length;

  return (
    <Link
      to="/workouts/$routineId"
      params={{ routineId: routine.id }}
      className="panel group flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Dumbbell className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-base font-semibold tracking-tight">
          {routine.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {count === 0 ? "No exercises yet" : `${count} exercise${count === 1 ? "" : "s"}`}
          {routine.description ? ` · ${routine.description}` : ""}
        </span>
      </span>
      {highlight ? (
        <span className="hidden shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:block">
          Start
        </span>
      ) : null}
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}