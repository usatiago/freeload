// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const HERO_IMAGE =
  "https://media.base44.com/images/public/6ad45e4e1290ee4e88e5f7ba/9e5f41a97_generated_image.png";

/** Starts a workout with nothing in it — exercises get added as you go. */
export default function QuickStartCard({ onStart, busy, disabled }) {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius)] border border-border shadow-soft animate-fade-up">
      <Image src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/35" />

      <div className="relative flex min-h-[16rem] flex-col justify-end gap-4 p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            Quick start
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-white">
            Start an empty workout
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/75">
            Nothing planned? Begin now and add exercises as you go.
          </p>
        </div>
        <Button onClick={onStart} disabled={disabled || busy} className="w-full sm:w-auto">
          <Play className="h-4 w-4" />
          {busy ? "Starting…" : "Start now"}
        </Button>
      </div>
    </section>
  );
}