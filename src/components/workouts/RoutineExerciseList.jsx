// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { categoryLabel } from "@/lib/exerciseCatalog";
import { distanceToDisplay, distanceUnit, weightToDisplay, weightUnit } from "@/lib/units";

function describeTargets(item, units) {
  const sets = item.target_sets ? `${item.target_sets} × ` : "";
  if (item.category === "strength") {
    const reps = item.target_reps ?? "—";
    const weight =
      item.target_weight == null
        ? ""
        : ` @ ${weightToDisplay(item.target_weight, units)} ${weightUnit(units)}`;
    return `${sets}${reps}${weight}`;
  }
  const minutes = item.target_minutes ? `${item.target_minutes} min` : "—";
  const distance =
    item.target_distance == null
      ? ""
      : ` · ${distanceToDisplay(item.target_distance, units)} ${distanceUnit(units)}`;
  return `${sets}${minutes}${distance}`;
}

export default function RoutineExerciseList({ exercises, units }) {
  if (!exercises || exercises.length === 0) {
    return (
      <p className="panel px-5 py-6 text-center text-sm text-muted-foreground">
        No exercises yet. Edit this workout to add some.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {exercises.map((item, index) => (
        <li key={`${item.exercise_id}-${index}`} className="panel flex items-center gap-4 px-4 py-3.5">
          <span className="figure text-xs text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.exercise_name}</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {categoryLabel(item.category)}
            </p>
          </div>
          <p className="figure shrink-0 text-sm font-medium">{describeTargets(item, units)}</p>
        </li>
      ))}
    </ol>
  );
}