// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { getOwnRecord } from "@/lib/records";

const RoutineExercise = z.object({
  exercise_id: z.string(),
  exercise_name: z.string().max(120),
  category: z.string().max(20),
  target_sets: z.number().min(0).max(50).nullable().optional(),
  target_reps: z.number().min(0).max(1000).nullable().optional(),
  target_weight: z.number().min(0).max(1000).nullable().optional(),
  target_minutes: z.number().min(0).max(1000).nullable().optional(),
  target_distance: z.number().min(0).max(1000).nullable().optional(),
});

export const listRoutines = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const { items } = await context.getBase44().entities.WorkoutRoutine.filter(
      { created_by_id: context.user.id },
      { sort: "-updated_date", limit: 100 },
    );
    return items;
  });

export const getRoutine = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string() }))
  .handler(({ data, context }) =>
    getOwnRecord(context.getBase44().entities.WorkoutRoutine, data.id, context.user.id),
  );

export const createRoutine = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ name: z.string().trim().min(1).max(80) }))
  .handler(({ data, context }) =>
    context.getBase44().entities.WorkoutRoutine.create({
      name: data.name,
      description: "",
      exercises: [],
    }),
  );

export const updateRoutine = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      id: z.string(),
      name: z.string().trim().min(1).max(80).optional(),
      description: z.string().max(500).optional(),
      exercises: z.array(RoutineExercise).max(40).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const routine = await getOwnRecord(base44.entities.WorkoutRoutine, data.id, context.user.id);
    if (!routine) throw Object.assign(new Error("Workout not found"), { status: 404 });
    const { id, ...patch } = data;
    return base44.entities.WorkoutRoutine.update(id, patch);
  });

export const deleteRoutine = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const routine = await getOwnRecord(base44.entities.WorkoutRoutine, data.id, context.user.id);
    if (!routine) return { ok: false };
    await base44.entities.WorkoutRoutine.delete(routine.id);
    return { ok: true };
  });