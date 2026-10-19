// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EXERCISE_CATEGORIES, categoryLabel } from "@/lib/exerciseCatalog";
import { cn } from "@/lib/utils";

/** Search the exercise library, or create a new exercise on the spot. */
export default function ExercisePickerDialog({ open, onOpenChange, exercises, onSelect, onCreate }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("strength");
  const [busy, setBusy] = useState(false);

  const term = query.trim();
  const results = useMemo(() => {
    const needle = term.toLowerCase();
    const list = needle
      ? exercises.filter(
          (item) =>
            item.name.toLowerCase().includes(needle) ||
            (item.muscle_group || "").toLowerCase().includes(needle) ||
            (item.equipment || "").toLowerCase().includes(needle),
        )
      : exercises;
    return list.slice(0, 80);
  }, [exercises, term]);

  const alreadyExists = exercises.some((item) => item.name.toLowerCase() === term.toLowerCase());

  const close = () => {
    setQuery("");
    setCategory("strength");
    onOpenChange(false);
  };

  const pick = (exercise) => {
    onSelect(exercise);
    close();
  };

  const create = async () => {
    if (!term || busy) return;
    setBusy(true);
    try {
      const created = await onCreate({ name: term, category });
      pick({
        id: created.id,
        name: created.name,
        category: created.category || category,
        muscle_group: created.muscle_group || "",
        equipment: created.equipment || "",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base font-semibold tracking-tight">
            Add an exercise
          </DialogTitle>
        </DialogHeader>

        <div className="border-b border-border px-5 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search exercises"
              className="h-11 pl-9"
            />
          </div>
        </div>

        <div className="max-h-[46vh] overflow-y-auto px-2 py-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Nothing matches “{term}”.
            </p>
          ) : (
            results.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => pick(exercise)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{exercise.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[categoryLabel(exercise.category), exercise.muscle_group, exercise.equipment]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))
          )}
        </div>

        {term && !alreadyExists ? (
          <div className="space-y-3 border-t border-border px-5 py-4">
            <p className="label-micro">Create “{term}”</p>
            <div className="flex flex-wrap gap-2">
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
            </div>
            <Button type="button" onClick={create} disabled={busy} className="w-full">
              {busy ? "Adding…" : `Add ${term} to my exercises`}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}