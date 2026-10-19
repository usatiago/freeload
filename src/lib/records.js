// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

/**
 * Reads one record and returns it only when the signed-in user created it.
 * A missing record (404) and someone else's record both come back as null, so a
 * caller can answer "not found" without leaking that the record exists.
 */
export async function getOwnRecord(entity, id, userId) {
  const record = await entity.get(id).catch((error) => {
    if (error?.status === 404) return null;
    throw error;
  });
  if (!record || record.created_by_id !== userId) return null;
  return record;
}