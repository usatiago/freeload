// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { EXERCISE_CATEGORIES, categoryLabel } from "@/lib/exerciseCatalog";
import { createExercise, deleteExercise, listCustomExercises } from "@/lib/exercise-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/exercises/")({
  ssr: false,
  loader: () => listCustomExercises(),
  head: () => ({ meta: [{ title: "Exercises" }] }),
  component: ExercisesPage,
});

function ExercisesPage() {
  const exercises = Route.useLoaderData();
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("strength");
  const [busy, setBusy] = useState(false);

  const add = async (event) => {
    event.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      await createExercise({ data: { name: name.trim(), category } });
      setName("");
      await router.invalidate();
    } catch {
      toast.error("Could not add that exercise");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    await deleteExercise({ data: { id } });
    await router.invalidate();
  };

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="My exercises"
        description="Anything you add is yours to use in workouts. The built-in library of around fifty exercises is always available too."
      />

      <form onSubmit={add} className="panel mb-6 space-y-4 p-5">
        <div className="space-y-2">
          <Label className="label-micro">New exercise</Label>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Sled push"
            className="h-12"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {EXERCISE_CATEGORIES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCategory(option.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === option.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              {option.label}
            </button>
          ))}
          <Button type="submit" className="ml-auto" disabled={busy || !name.trim()}>
            <Plus className="h-4 w-4" />
            {busy ? "Adding…" : "Add"}
          </Button>
        </div>
      </form>

      {exercises.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No custom exercises"
          description="Add one above, or create it on the spot while you're building a workout."
        />
      ) : (
        <ul className="space-y-2">
          {exercises.map((exercise) => (
            <li key={exercise.id} className="panel flex items-center gap-4 px-4 py-3.5 animate-fade-up">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{exercise.name}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {categoryLabel(exercise.category)}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Delete ${exercise.name}`}
                onClick={() => remove(exercise.id)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}