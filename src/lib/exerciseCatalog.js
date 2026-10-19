// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

// The built-in exercise library. It ships with the app so every user starts with
// a full list; exercises a user adds themselves are stored in the Exercise entity
// and merged in here. Built-in ids are stable slugs, stored on routines and logged
// sets so history keeps working even if a custom exercise is deleted.

export const EXERCISE_CATEGORIES = [
  { value: "strength", label: "Strength" },
  { value: "cardio", label: "Cardio" },
  { value: "mobility", label: "Mobility" },
];

const strength = (id, name, muscle_group, equipment) => ({ id, name, category: "strength", muscle_group, equipment });
const cardio = (id, name, muscle_group, equipment) => ({ id, name, category: "cardio", muscle_group, equipment });
const mobility = (id, name, muscle_group, equipment) => ({ id, name, category: "mobility", muscle_group, equipment });

export const BUILT_IN_EXERCISES = [
  strength("bench-press", "Bench Press", "Chest", "Barbell"),
  strength("incline-bench-press", "Incline Bench Press", "Chest", "Barbell"),
  strength("dumbbell-fly", "Dumbbell Fly", "Chest", "Dumbbell"),
  strength("push-up", "Push-up", "Chest", "Bodyweight"),
  strength("dip", "Chest Dip", "Chest", "Bodyweight"),
  strength("overhead-press", "Overhead Press", "Shoulders", "Barbell"),
  strength("lateral-raise", "Lateral Raise", "Shoulders", "Dumbbell"),
  strength("face-pull", "Face Pull", "Shoulders", "Cable"),
  strength("shrug", "Barbell Shrug", "Shoulders", "Barbell"),
  strength("pull-up", "Pull-up", "Back", "Bodyweight"),
  strength("bent-over-row", "Bent Over Row", "Back", "Barbell"),
  strength("lat-pulldown", "Lat Pulldown", "Back", "Cable"),
  strength("seated-cable-row", "Seated Cable Row", "Back", "Cable"),
  strength("deadlift", "Deadlift", "Back", "Barbell"),
  strength("back-squat", "Back Squat", "Legs", "Barbell"),
  strength("front-squat", "Front Squat", "Legs", "Barbell"),
  strength("romanian-deadlift", "Romanian Deadlift", "Legs", "Barbell"),
  strength("leg-press", "Leg Press", "Legs", "Machine"),
  strength("walking-lunge", "Walking Lunge", "Legs", "Dumbbell"),
  strength("leg-curl", "Leg Curl", "Legs", "Machine"),
  strength("leg-extension", "Leg Extension", "Legs", "Machine"),
  strength("calf-raise", "Standing Calf Raise", "Legs", "Machine"),
  strength("hip-thrust", "Hip Thrust", "Glutes", "Barbell"),
  strength("barbell-curl", "Barbell Curl", "Arms", "Barbell"),
  strength("dumbbell-curl", "Dumbbell Curl", "Arms", "Dumbbell"),
  strength("hammer-curl", "Hammer Curl", "Arms", "Dumbbell"),
  strength("triceps-pushdown", "Triceps Pushdown", "Arms", "Cable"),
  strength("overhead-triceps-extension", "Overhead Triceps Extension", "Arms", "Dumbbell"),
  strength("plank", "Plank", "Core", "Bodyweight"),
  strength("crunch", "Crunch", "Core", "Bodyweight"),
  strength("hanging-leg-raise", "Hanging Leg Raise", "Core", "Bodyweight"),
  strength("russian-twist", "Russian Twist", "Core", "Bodyweight"),
  strength("farmers-carry", "Farmer's Carry", "Full Body", "Dumbbell"),
  cardio("treadmill-run", "Treadmill Run", "Cardio", "Treadmill"),
  cardio("outdoor-run", "Outdoor Run", "Cardio", "None"),
  cardio("cycling", "Cycling", "Cardio", "Bike"),
  cardio("rowing-machine", "Rowing Machine", "Cardio", "Machine"),
  cardio("elliptical", "Elliptical", "Cardio", "Machine"),
  cardio("stair-climber", "Stair Climber", "Cardio", "Machine"),
  cardio("jump-rope", "Jump Rope", "Cardio", "Rope"),
  cardio("walking", "Walking", "Cardio", "None"),
  cardio("swimming", "Swimming", "Cardio", "Pool"),
  cardio("burpee", "Burpee", "Full Body", "Bodyweight"),
  cardio("kettlebell-swing", "Kettlebell Swing", "Full Body", "Kettlebell"),
  cardio("box-jump", "Box Jump", "Legs", "Box"),
  mobility("hamstring-stretch", "Hamstring Stretch", "Legs", "None"),
  mobility("hip-flexor-stretch", "Hip Flexor Stretch", "Hips", "None"),
  mobility("shoulder-dislocate", "Shoulder Dislocate", "Shoulders", "Band"),
  mobility("cat-cow", "Cat-Cow", "Back", "None"),
  mobility("downward-dog", "Downward Dog", "Full Body", "None"),
  mobility("foam-roll", "Foam Roll", "Full Body", "Foam Roller"),
];

/** Built-in library plus the signed-in user's own exercises, sorted by name. */
export function mergeExercises(custom) {
  const extra = (custom || []).map((record) => ({
    id: record.id,
    name: record.name,
    category: record.category || "strength",
    muscle_group: record.muscle_group || "",
    equipment: record.equipment || "",
    custom: true,
  }));
  return [...BUILT_IN_EXERCISES, ...extra].sort((a, b) => a.name.localeCompare(b.name));
}

export function findExercise(exercises, id) {
  return (exercises || []).find((exercise) => exercise.id === id) || null;
}

export function categoryLabel(category) {
  return EXERCISE_CATEGORIES.find((item) => item.value === category)?.label || "Strength";
}

/** Cardio and mobility exercises are measured in time, not reps and weight. */
export function isTimed(category) {
  return category === "cardio" || category === "mobility";
}