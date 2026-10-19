// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categoryLabel, isTimed } from "@/lib/exerciseCatalog";
import { distanceUnit, weightUnit } from "@/lib/units";

/**
 * One exercise inside the routine editor. Target weights and distances are held in
 * the user's display units here and converted when the workout is saved.
 */
export default function RoutineExerciseRow({ item, index, total, units, onPatch, onRemove, onMove }) {
  const timed = isTimed(item.category);
  const cardio = item.category === "cardio";

  const numberField = (key, label, suffix, step) => (
    <label className="block">
      <span className="label-micro mb-1.5 block">{label}</span>
      <div className="relative">
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          step={step || "1"}
          value={item[key] ?? ""}
          onChange={(event) =>
            onPatch({ [key]: event.target.value === "" ? null : Number(event.target.value) })
          }
          placeholder="—"
          className={suffix ? "h-11 pr-10 text-center figure text-sm" : "h-11 text-center figure text-sm"}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );

  return (
    <div className="panel animate-fade-up p-4">
      <div className="flex items-start gap-3">
        <span className="figure pt-0.5 text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium leading-tight">{item.exercise_name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {categoryLabel(item.category)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label="Move up"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Move down"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Remove exercise"
            onClick={onRemove}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {numberField("target_sets", "Sets", null)}
        {timed
          ? numberField("target_minutes", "Minutes", "min", "0.5")
          : numberField("target_reps", "Reps", null)}
        {cardio
          ? numberField("target_distance", "Distance", distanceUnit(units), "0.1")
          : timed
            ? null
            : numberField("target_weight", "Weight", weightUnit(units), "0.5")}
      </div>
    </div>
  );
}