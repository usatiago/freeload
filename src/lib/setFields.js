// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

import { cn } from "@/lib/utils";
import { distanceUnit, weightUnit } from "@/lib/units";

/**
 * Which numbers a set collects depends on the exercise: strength work is reps and
 * weight, cardio is time (and distance), mobility is time only.
 */
export function setFields(category, units) {
  if (category === "cardio") {
    return [
      { key: "minutes", label: "Min" },
      { key: "distance", label: `Dist (${distanceUnit(units)})` },
    ];
  }
  if (category === "mobility") {
    return [{ key: "minutes", label: "Min" }];
  }
  return [
    { key: "weight", label: `Weight (${weightUnit(units)})` },
    { key: "reps", label: "Reps" },
  ];
}

/** Column template shared by the set header and every set row. */
export function fieldGridClass(fields, extra) {
  return cn(
    extra,
    fields.length > 1 ? "grid-cols-[1.75rem_1fr_1fr_2.5rem]" : "grid-cols-[1.75rem_1fr_2.5rem]",
  );
}