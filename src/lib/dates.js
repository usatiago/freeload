// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

// Dates are formatted with an explicit locale and time zone so the server-rendered
// markup and the browser never disagree. Weeks are keyed by ISO week in UTC and
// stored alongside each logged set, which makes progress grouping a single query.

export function isoWeekKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNumber = day.getUTCDay() || 7;
  day.setUTCDate(day.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((day - yearStart) / 86400000 + 1) / 7);
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function weekMonday(key) {
  const [year, week] = String(key).split("-W").map(Number);
  const january4 = new Date(Date.UTC(year, 0, 4));
  const dayNumber = january4.getUTCDay() || 7;
  const monday = new Date(january4);
  monday.setUTCDate(january4.getUTCDate() - dayNumber + 1 + (week - 1) * 7);
  return monday;
}

export function weekLabel(key) {
  return weekMonday(key).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/** Midnight UTC on the Monday of the current week, as an ISO string. */
export function currentWeekStartIso() {
  const now = new Date();
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayNumber = monday.getUTCDay() || 7;
  monday.setUTCDate(monday.getUTCDate() - (dayNumber - 1));
  return monday.toISOString();
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${total % 60}s`;
}

export function formatClock(seconds) {
  const total = Math.max(0, Math.round(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${pad(minutes)}:${pad(secs)}`;
}

export function formatDate(value, extra) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...(extra || {}),
  });
}

export function formatDateShort(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}

export function formatDayHeading(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  if (Number.isNaN(born.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - born.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - born.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < born.getUTCDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
}