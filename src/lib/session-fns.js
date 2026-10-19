// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { getOwnRecord } from "@/lib/records";
import { isoWeekKey } from "@/lib/dates";
import { isLoggedSet } from "@/lib/loggedSets";

const SetInput = z.object({
  reps: z.number().min(0).max(10000).nullable().optional(),
  weight: z.number().min(0).max(2000).nullable().optional(),
  minutes: z.number().min(0).max(1440).nullable().optional(),
  distance: z.number().min(0).max(1000).nullable().optional(),
  done: z.boolean().optional(),
  planned: z.boolean().optional(),
});

const EntryInput = z.object({
  exercise_id: z.string(),
  exercise_name: z.string().max(120),
  category: z.string().max(20),
  sets: z.array(SetInput).max(50),
});

const SESSION_FIELDS = [
  "id",
  "name",
  "routine_id",
  "status",
  "started_at",
  "completed_at",
  "duration_seconds",
  "notes",
  "total_volume",
  "total_sets",
  "exercise_count",
];

export const getActiveSession = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const { items } = await context.getBase44().entities.WorkoutSession.filter(
      { created_by_id: context.user.id, status: "in_progress" },
      { sort: "-started_at", limit: 1 },
    );
    return items[0] || null;
  });

export const listSessions = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .validator(z.object({ limit: z.number().min(1).max(100).optional() }))
  .handler(async ({ data, context }) => {
    const { items } = await context.getBase44().entities.WorkoutSession.filter(
      { created_by_id: context.user.id, status: "completed" },
      { sort: "-started_at", limit: data?.limit || 50, fields: SESSION_FIELDS },
    );
    return items;
  });

/** The full record, including every logged set — used by the logger and the detail view. */
export const getSession = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string() }))
  .handler(({ data, context }) =>
    getOwnRecord(context.getBase44().entities.WorkoutSession, data.id, context.user.id),
  );

/** Starts a session: empty, or pre-filled from a saved workout. */
export const startSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ routineId: z.string().optional(), name: z.string().max(80).optional() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    let name = data.name?.trim() || "Quick workout";
    let routineId = null;
    let entries = [];

    if (data.routineId) {
      const routine = await getOwnRecord(base44.entities.WorkoutRoutine, data.routineId, context.user.id);
      if (!routine) throw Object.assign(new Error("Workout not found"), { status: 404 });
      name = routine.name;
      routineId = routine.id;
      entries = (routine.exercises || []).map((item) => ({
        exercise_id: item.exercise_id,
        exercise_name: item.exercise_name,
        category: item.category || "strength",
        sets: Array.from({ length: Math.max(1, Math.min(20, item.target_sets || 1)) }, () => ({
          reps: item.target_reps ?? null,
          weight: item.target_weight ?? null,
          minutes: item.target_minutes ?? null,
          distance: item.target_distance ?? null,
          done: false,
          planned: true,
        })),
      }));
    }

    return base44.entities.WorkoutSession.create({
      name,
      routine_id: routineId,
      status: "in_progress",
      started_at: new Date().toISOString(),
      entries,
      notes: "",
      total_volume: 0,
      total_sets: 0,
      exercise_count: entries.length,
    });
  });

/** Saves the working copy of a session while it is still being logged. */
export const saveSessionEntries = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string(), entries: z.array(EntryInput).max(40) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const session = await getOwnRecord(base44.entities.WorkoutSession, data.id, context.user.id);
    if (!session) throw Object.assign(new Error("Session not found"), { status: 404 });
    return base44.entities.WorkoutSession.update(data.id, {
      entries: data.entries,
      exercise_count: data.entries.length,
    });
  });

/** Closes a session: totals the work done and writes one row per set for progress. */
export const finishSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      id: z.string(),
      name: z.string().max(80).optional(),
      notes: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const session = await getOwnRecord(base44.entities.WorkoutSession, data.id, context.user.id);
    if (!session) throw Object.assign(new Error("Session not found"), { status: 404 });

    const completedAt = new Date();
    const startedAt = session.started_at ? new Date(session.started_at) : completedAt;
    const durationSeconds = Math.max(0, Math.round((completedAt - startedAt) / 1000));
    const weekKey = isoWeekKey(completedAt);
    const entries = session.entries || [];

    let totalVolume = 0;
    let totalSets = 0;
    const logs = [];

    entries.forEach((entry) => {
      (entry.sets || []).forEach((set) => {
        if (!isLoggedSet(set)) return;
        const volume = (set.reps || 0) * (set.weight || 0);
        totalVolume += volume;
        totalSets += 1;
        logs.push({
          session_id: session.id,
          exercise_id: entry.exercise_id,
          exercise_name: entry.exercise_name,
          category: entry.category || "strength",
          performed_at: completedAt.toISOString(),
          week_key: weekKey,
          reps: set.reps ?? null,
          weight: set.weight ?? null,
          minutes: set.minutes ?? null,
          distance: set.distance ?? null,
          volume,
        });
      });
    });

    if (logs.length) await base44.entities.SetLog.bulkCreate(logs);

    return base44.entities.WorkoutSession.update(session.id, {
      status: "completed",
      completed_at: completedAt.toISOString(),
      duration_seconds: durationSeconds,
      name: data.name?.trim() || session.name,
      notes: data.notes ?? session.notes ?? "",
      total_volume: totalVolume,
      total_sets: totalSets,
      exercise_count: entries.length,
    });
  });

export const deleteSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const session = await getOwnRecord(base44.entities.WorkoutSession, data.id, context.user.id);
    if (!session) return { ok: false };
    await base44.entities.SetLog.deleteMany({
      session_id: session.id,
      created_by_id: context.user.id,
    });
    await base44.entities.WorkoutSession.delete(session.id);
    return { ok: true };
  });