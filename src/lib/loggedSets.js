// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

/**
 * Whether a set counts as work actually done.
 *
 * A set that came from a saved workout is pre-filled with the targets you planned
 * (`planned`), so it only counts once you tick it off — otherwise a workout you
 * never touched would look like a finished one. A set you typed numbers into is
 * real the moment it has a value, ticked or not.
 */
export function isLoggedSet(set) {
  if (!set) return false;
  if (set.done) return true;
  if (set.planned) return false;
  return Boolean(set.reps || set.weight || set.minutes || set.distance);
}

export function computeTotals(entries) {
  let volume = 0;
  let sets = 0;
  (entries || []).forEach((entry) => {
    (entry.sets || []).forEach((set) => {
      if (!isLoggedSet(set)) return;
      volume += (set.reps || 0) * (set.weight || 0);
      sets += 1;
    });
  });
  return { volume, sets };
}