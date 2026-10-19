// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { currentWeekStartIso } from "@/lib/dates";

const firstRow = (result) => (result?.rows || [])[0] || {};

const readTotals = (row) => ({
  sessions: row.count || 0,
  seconds: row.sum_duration_seconds || 0,
  volume: row.sum_total_volume || 0,
  sets: row.sum_total_sets || 0,
});

/** Workouts, time and volume for the current week, for the home screen. */
export const getWeekStats = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const result = await context.getBase44().entities.WorkoutSession.aggregate({
      query: {
        created_by_id: context.user.id,
        status: "completed",
        started_at: { $gte: currentWeekStartIso() },
      },
      sum: ["duration_seconds", "total_volume", "total_sets"],
    });
    return readTotals(firstRow(result));
  });

/** Lifetime totals across every finished workout. */
export const getLifetimeStats = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const result = await context.getBase44().entities.WorkoutSession.aggregate({
      query: { created_by_id: context.user.id, status: "completed" },
      sum: ["duration_seconds", "total_volume", "total_sets"],
    });
    return readTotals(firstRow(result));
  });

/** Volume and minutes per week, newest first, reversed by the caller for charting. */
export const getWeeklyVolume = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const result = await context.getBase44().entities.SetLog.aggregate({
      query: { created_by_id: context.user.id },
      groupBy: "week_key",
      sum: ["volume", "minutes"],
      sort: "-week_key",
      limit: 12,
    });
    return (result?.rows || [])
      .filter((row) => row.week_key)
      .map((row) => ({
        week: row.week_key,
        volume: row.sum_volume || 0,
        minutes: row.sum_minutes || 0,
        sets: row.count || 0,
      }))
      .reverse();
  });

/** The exercises with the most total work logged, for the progress picker. */
export const getTopExercises = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const result = await context.getBase44().entities.SetLog.aggregate({
      query: { created_by_id: context.user.id },
      groupBy: "exercise_name",
      sum: ["volume"],
      sort: "-sum_volume",
      limit: 10,
    });
    return (result?.rows || [])
      .filter((row) => row.exercise_name)
      .map((row) => ({ name: row.exercise_name, volume: row.sum_volume || 0, sets: row.count || 0 }));
  });

/** Week-by-week history for one exercise. */
export const getExerciseTrend = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .validator(z.object({ exerciseName: z.string().min(1).max(120) }))
  .handler(async ({ data, context }) => {
    const result = await context.getBase44().entities.SetLog.aggregate({
      query: { created_by_id: context.user.id, exercise_name: data.exerciseName },
      groupBy: "week_key",
      sum: ["volume", "minutes", "reps"],
      sort: "-week_key",
      limit: 12,
    });
    return (result?.rows || [])
      .filter((row) => row.week_key)
      .map((row) => ({
        week: row.week_key,
        volume: row.sum_volume || 0,
        minutes: row.sum_minutes || 0,
        reps: row.sum_reps || 0,
        sets: row.count || 0,
      }))
      .reverse();
  });