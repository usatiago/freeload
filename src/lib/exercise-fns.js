// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

/** The signed-in user's own exercises; the built-in library lives in the app. */
export const listCustomExercises = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const { items } = await context.getBase44().entities.Exercise.filter(
      { created_by_id: context.user.id },
      { sort: "name", limit: 200 },
    );
    return items;
  });

export const createExercise = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      name: z.string().trim().min(1).max(80),
      category: z.enum(["strength", "cardio", "mobility"]),
      muscle_group: z.string().max(60).optional(),
      equipment: z.string().max(60).optional(),
    }),
  )
  .handler(({ data, context }) =>
    context.getBase44().entities.Exercise.create({ ...data, is_custom: true }),
  );

export const deleteExercise = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const existing = await base44.entities.Exercise.get(data.id).catch((error) => {
      if (error?.status === 404) return null;
      throw error;
    });
    if (!existing || existing.created_by_id !== context.user.id) return { ok: false };
    await base44.entities.Exercise.delete(data.id);
    return { ok: true };
  });