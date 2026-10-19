// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/lib/exerciseCatalog";
import { fieldGridClass, setFields } from "@/lib/setFields";
import SetRow from "@/components/session/SetRow";

export default function ExerciseLogger({ entry, index, units, onPatchSet, onAddSet, onRemoveSet, onRemove }) {
  const fields = setFields(entry.category, units);
  const sets = entry.sets || [];

  return (
    <section className="panel animate-fade-up overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="figure text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium leading-tight">{entry.exercise_name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {categoryLabel(entry.category)}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Remove ${entry.exercise_name}`}
          onClick={onRemove}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="px-4 py-4">
        <div className={fieldGridClass(fields, "mb-2 grid items-center gap-2")}>
          <span className="label-micro text-center">Set</span>
          {fields.map((field) => (
            <span key={field.key} className="label-micro text-center">
              {field.label}
            </span>
          ))}
          <span />
        </div>

        <div className="space-y-2">
          {sets.map((set, setIndex) => (
            <SetRow
              key={setIndex}
              index={setIndex}
              set={set}
              fields={fields}
              units={units}
              onCommit={(patch) => onPatchSet(setIndex, patch)}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onAddSet}>
            <Plus className="h-3.5 w-3.5" />
            Add set
          </Button>
          {sets.length > 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => onRemoveSet(sets.length - 1)}
            >
              Remove last set
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}