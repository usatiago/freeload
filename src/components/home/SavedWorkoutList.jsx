// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Saved workouts, one tap from starting. */
export default function SavedWorkoutList({ routines, onStart, pendingId, disabled }) {
  if (routines.length === 0) {
    return (
      <section className="panel flex flex-col justify-between gap-6 p-6 animate-fade-up">
        <div>
          <p className="label-micro">From your workouts</p>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">No saved workouts</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Build one with the exercises and targets you use, then start it in a tap.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/workouts">Build a workout</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden animate-fade-up">
      <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <p className="label-micro">From your workouts</p>
        <Link to="/workouts" className="text-xs font-medium text-primary underline-offset-4 hover:underline">
          See all
        </Link>
      </header>
      <ul className="divide-y divide-border">
        {routines.slice(0, 4).map((routine) => {
          const count = (routine.exercises || []).length;
          return (
            <li key={routine.id}>
              <button
                type="button"
                disabled={disabled || pendingId === routine.id}
                onClick={() => onStart(routine.id)}
                className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-accent disabled:opacity-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{routine.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {count === 0 ? "No exercises" : `${count} exercise${count === 1 ? "" : "s"}`}
                  </span>
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Play className="h-3 w-3" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}