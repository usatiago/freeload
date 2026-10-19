// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

// All weights and distances are stored in kilograms and kilometres, and heights
// in centimetres. These helpers convert for display according to the profile's
// unit preference, so the stored numbers never depend on the unit a user picks.

export const KG_PER_LB = 0.45359237;
export const KM_PER_MILE = 1.609344;
export const CM_PER_INCH = 2.54;

export const round1 = (value) => (Number.isFinite(value) ? Math.round(value * 10) / 10 : 0);

export const weightUnit = (units) => (units === "imperial" ? "lb" : "kg");
export const distanceUnit = (units) => (units === "imperial" ? "mi" : "km");
export const heightUnit = (units) => (units === "imperial" ? "in" : "cm");

export const weightToDisplay = (kg, units) =>
  Number.isFinite(kg) ? round1(units === "imperial" ? kg / KG_PER_LB : kg) : null;
export const weightFromDisplay = (value, units) => (units === "imperial" ? value * KG_PER_LB : value);

export const distanceToDisplay = (km, units) =>
  Number.isFinite(km) ? round1(units === "imperial" ? km / KM_PER_MILE : km) : null;
export const distanceFromDisplay = (value, units) => (units === "imperial" ? value * KM_PER_MILE : value);

export const heightToDisplay = (cm, units) =>
  Number.isFinite(cm) ? round1(units === "imperial" ? cm / CM_PER_INCH : cm) : null;
export const heightFromDisplay = (value, units) => (units === "imperial" ? value * CM_PER_INCH : value);

export function formatWeight(kg, units) {
  const value = weightToDisplay(kg, units);
  return value === null ? "—" : `${value} ${weightUnit(units)}`;
}

export function formatHeight(cm, units) {
  const value = heightToDisplay(cm, units);
  return value === null ? "—" : `${value} ${heightUnit(units)}`;
}

/** Total kilograms moved in one set: reps × weight. */
export const setVolume = (reps, weight) => (reps || 0) * (weight || 0);