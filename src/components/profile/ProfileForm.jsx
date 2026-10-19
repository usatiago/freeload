// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { heightFromDisplay, heightToDisplay, heightUnit, weightFromDisplay, weightToDisplay, weightUnit } from "@/lib/units";

/** Age comes from the birth date; height and weight are edited in the chosen units. */
export default function ProfileForm({ profile, onSave, saving }) {
  const units = profile?.units || "imperial";
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    setHeight(profile?.height_cm == null ? "" : String(heightToDisplay(profile.height_cm, units)));
    setWeight(profile?.weight_kg == null ? "" : String(weightToDisplay(profile.weight_kg, units)));
    setBirthDate(profile?.birth_date || "");
  }, [profile, units]);

  const unit = units;

  const submit = (event) => {
    event.preventDefault();
    onSave({
      units,
      height_cm: height === "" ? null : heightFromDisplay(Number(height), unit),
      weight_kg: weight === "" ? null : weightFromDisplay(Number(weight), unit),
      birth_date: birthDate || null,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex gap-2">
        {["imperial", "metric"].map((option) => (
          <button
            key={option}
            type="button"
            disabled
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium capitalize",
              unit === option ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground",
            )}
          >
            {option}
          </button>
        ))}
        <p className="self-center text-xs text-muted-foreground">Set in Settings › Units</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label className="label-micro">Height</Label>
          <div className="relative">
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={height}
              onChange={(event) => setHeight(event.target.value)}
              placeholder="—"
              className="h-11 pr-10 figure"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {heightUnit(unit)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="label-micro">Weight</Label>
          <div className="relative">
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="—"
              className="h-11 pr-10 figure"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {weightUnit(unit)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="label-micro">Birth date</Label>
          <Input
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            className="h-11 figure"
          />
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}