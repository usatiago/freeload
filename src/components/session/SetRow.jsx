// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fieldGridClass } from "@/lib/setFields";
import { distanceToDisplay, distanceFromDisplay, weightToDisplay, weightFromDisplay } from "@/lib/units";

const COMMIT_DELAY = 500;

const numberOrNull = (value) => (value === "" || value === null || value === undefined ? null : Number(value));

const draftOf = (set, units) => ({
  reps: set.reps ?? "",
  weight: set.weight === null || set.weight === undefined ? "" : String(weightToDisplay(set.weight, units)),
  minutes: set.minutes ?? "",
  distance:
    set.distance === null || set.distance === undefined ? "" : String(distanceToDisplay(set.distance, units)),
});

/**
 * One logged set. The inputs hold their own draft so typing stays smooth, and the
 * values are saved automatically — half a second after you stop typing, on blur,
 * or the instant you tick the set off. Values are stored in kilograms and
 * kilometres regardless of the unit shown.
 */
export default function SetRow({ index, set, fields, units, onCommit }) {
  const [draft, setDraft] = useState(() => draftOf(set, units));
  const draftRef = useRef(draft);
  const timer = useRef(null);
  draftRef.current = draft;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const toValues = (next) => {
    const weight = numberOrNull(next.weight);
    const distance = numberOrNull(next.distance);
    return {
      reps: numberOrNull(next.reps),
      weight: weight === null ? null : weightFromDisplay(weight, units),
      minutes: numberOrNull(next.minutes),
      distance: distance === null ? null : distanceFromDisplay(distance, units),
      // Typed-in numbers are real work, not the routine's plan.
      planned: false,
    };
  };

  const cancelPending = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const change = (key, value) => {
    const next = { ...draftRef.current, [key]: value };
    draftRef.current = next;
    setDraft(next);
    cancelPending();
    timer.current = setTimeout(() => {
      timer.current = null;
      onCommit(toValues(next));
    }, COMMIT_DELAY);
  };

  const commitNow = () => {
    cancelPending();
    onCommit(toValues(draftRef.current));
  };

  const toggleDone = () => {
    cancelPending();
    onCommit({ ...toValues(draftRef.current), done: !set.done });
  };

  return (
    <div className={fieldGridClass(fields, "grid items-center gap-2")}>
      <span className="text-center text-xs text-muted-foreground">{index + 1}</span>

      {fields.map((field) => (
        <Input
          key={field.key}
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          placeholder="—"
          value={draft[field.key] ?? ""}
          onChange={(event) => change(field.key, event.target.value)}
          onBlur={commitNow}
          className={cn(
            "h-11 text-center figure text-sm transition-colors",
            set.done ? "border-primary/40 bg-primary/5" : "",
          )}
        />
      ))}

      <button
        type="button"
        aria-label={set.done ? `Mark set ${index + 1} not done` : `Mark set ${index + 1} done`}
        aria-checked={Boolean(set.done)}
        role="checkbox"
        onClick={toggleDone}
        className={cn(
          "grid h-11 w-11 place-items-center rounded-xl border-2 transition-all duration-200 active:scale-95",
          set.done
            ? "border-success bg-success text-success-foreground shadow-sm"
            : "border-border bg-transparent text-transparent hover:border-success/50 hover:bg-success/5",
        )}
      >
        <Check
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            set.done ? "scale-100" : "scale-75",
          )}
        />
      </button>
    </div>
  );
}