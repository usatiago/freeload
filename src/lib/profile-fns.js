// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const { items } = await context.getBase44().entities.UserProfile.filter(
      { created_by_id: context.user.id },
      { sort: "-updated_date", limit: 1 },
    );
    return items[0] || null;
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      height_cm: z.number().positive().max(300).nullable(),
      weight_kg: z.number().positive().max(700).nullable(),
      birth_date: z.string().max(20).nullable(),
      units: z.enum(["metric", "imperial"]),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const { items } = await base44.entities.UserProfile.filter(
      { created_by_id: context.user.id },
      { limit: 1 },
    );
    if (items[0]) return base44.entities.UserProfile.update(items[0].id, data);
    return base44.entities.UserProfile.create(data);
  });

/** Stores the Google Health on/off choice without touching the saved measurements. */
export const setHealthSync = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ enabled: z.boolean() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const { items } = await base44.entities.UserProfile.filter(
      { created_by_id: context.user.id },
      { limit: 1 },
    );
    if (items[0]) {
      return base44.entities.UserProfile.update(items[0].id, { google_health_enabled: data.enabled });
    }
    return base44.entities.UserProfile.create({ google_health_enabled: data.enabled });
  });