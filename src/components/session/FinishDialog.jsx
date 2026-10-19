// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useElapsed from "@/hooks/useElapsed";
import { formatClock } from "@/lib/dates";
import { round1, weightUnit } from "@/lib/units";
import { computeTotals } from "@/lib/loggedSets";

/** Confirms the workout name and notes before the session is closed and saved. */
export default function FinishDialog({ open, onOpenChange, session, entries, units, onConfirm, busy }) {
  const [name, setName] = useState(session.name || "");
  const [notes, setNotes] = useState(session.notes || "");
  const elapsed = useElapsed(session.started_at, open);

  const totals = useMemo(() => computeTotals(entries), [entries]);

  const unit = weightUnit(units);
  const displayVolume = units === "imperial" ? round1(totals.volume * 2.20462262) : Math.round(totals.volume);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="font-display text-base font-semibold tracking-tight">
            Finish workout
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          {[
            { label: "Time", value: formatClock(elapsed) },
            { label: "Sets", value: String(totals.sets) },
            { label: `Volume (${unit})`, value: String(displayVolume) },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-3 text-center">
              <p className="label-micro">{stat.label}</p>
              <p className="figure mt-1.5 text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="space-y-2">
            <Label className="label-micro">Workout name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Workout" />
          </div>
          <div className="space-y-2">
            <Label className="label-micro">Notes</Label>
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="How did it feel?"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={busy}>
            Keep logging
          </Button>
          <Button
            className="flex-1"
            onClick={() => onConfirm({ name: name.trim() || session.name || "Workout", notes })}
            disabled={busy}
          >
            {busy ? "Saving…" : "Finish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}