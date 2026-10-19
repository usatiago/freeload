// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Dumbbell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import ExercisePickerDialog from "@/components/ExercisePickerDialog";
import ExerciseLogger from "@/components/session/ExerciseLogger";
import FinishDialog from "@/components/session/FinishDialog";
import SessionTimer from "@/components/session/SessionTimer";
import { createExercise } from "@/lib/exercise-fns";
import { finishSession, saveSessionEntries } from "@/lib/session-fns";
import { playCheer } from "@/lib/cheer";

const blankSet = () => ({
  reps: null,
  weight: null,
  minutes: null,
  distance: null,
  done: false,
  planned: false,
});

/** Every set of an exercise has been ticked off. */
const allSetsDone = (entry) => {
  const sets = entry?.sets || [];
  return sets.length > 0 && sets.every((set) => set.done);
};

const newEntry = (exercise) => ({
  exercise_id: exercise.id,
  exercise_name: exercise.name,
  category: exercise.category || "strength",
  sets: [blankSet()],
});

/** The live logging screen for a workout that is still in progress. */
export default function ActiveSession({ session, library, units }) {
  const router = useRouter();
  const [entries, setEntries] = useState(() => session.entries || []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);
  // Saves are chained so a slow request can never overwrite a newer one.
  const chain = useRef(Promise.resolve());

  const persist = (next) => {
    setSaving(true);
    chain.current = chain.current
      .then(() => saveSessionEntries({ data: { id: session.id, entries: next } }))
      .then(() => setSaving(false))
      .catch(() => {
        setSaving(false);
        toast.error("Could not save your last change");
      });
  };

  const commit = (mutate, onApplied) => {
    const next = mutate(entries);
    setEntries(next);
    persist(next);
    if (onApplied) onApplied(entries, next);
  };

  const patchSet = (entryIndex, setIndex, patch) =>
    commit(
      (list) =>
        list.map((entry, i) =>
          i !== entryIndex
            ? entry
            : {
                ...entry,
                sets: (entry.sets || []).map((set, j) => (j !== setIndex ? set : { ...set, ...patch })),
              },
        ),
      // Cheer only on the tick that completes an exercise, not on later edits.
      (prev, next) => {
        if (allSetsDone(next[entryIndex]) && !allSetsDone(prev[entryIndex])) playCheer();
      },
    );

  const addSet = (entryIndex) =>
    commit((list) =>
      list.map((entry, i) =>
        i !== entryIndex ? entry : { ...entry, sets: [...(entry.sets || []), blankSet()] },
      ),
    );

  const removeLastSet = (entryIndex) =>
    commit((list) =>
      list.map((entry, i) =>
        i !== entryIndex ? entry : { ...entry, sets: (entry.sets || []).slice(0, -1) },
      ),
    );

  const addEntry = (exercise) => commit((list) => [...list, newEntry(exercise)]);

  const finish = async (values) => {
    setFinishing(true);
    try {
      // Let any queued set edits land before the session is totalled up.
      await chain.current;
      await finishSession({ data: { id: session.id, name: values.name, notes: values.notes } });
      setFinishOpen(false);
      await router.invalidate();
    } catch {
      toast.error("Could not finish the workout");
    } finally {
      setFinishing(false);
    }
  };

  return (
    <>
      <header className="mb-6 flex items-start justify-between gap-3 animate-fade-up">
        <div className="min-w-0">
          <p className="label-micro mb-1.5">In progress</p>
          <h1 className="truncate font-display text-2xl font-semibold tracking-tight">{session.name}</h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <SessionTimer startedAt={session.started_at} />
            <span>·</span>
            <span>
              {entries.length} exercise{entries.length === 1 ? "" : "s"}
            </span>
            {saving ? (
              <>
                <span>·</span>
                <span className="text-primary">Saving…</span>
              </>
            ) : null}
          </p>
        </div>
        <Button size="sm" className="shrink-0" onClick={() => setFinishOpen(true)}>
          Finish
        </Button>
      </header>

      {entries.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="Empty workout"
          description="Add exercises as you go — log a set the moment you finish it."
          action={
            <Button onClick={() => setPickerOpen(true)}>
              <Plus className="h-4 w-4" />
              Add your first exercise
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <ExerciseLogger
                key={`${entry.exercise_id}-${index}`}
                entry={entry}
                index={index}
                units={units}
                onPatchSet={(setIndex, patch) => patchSet(index, setIndex, patch)}
                onAddSet={() => addSet(index)}
                onRemoveSet={() => removeLastSet(index)}
                onRemove={() => commit((list) => list.filter((_, i) => i !== index))}
              />
            ))}
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full border-dashed"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add exercise
          </Button>
        </>
      )}

      <ExercisePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        exercises={library}
        onSelect={addEntry}
        onCreate={(values) => createExercise({ data: values })}
      />

      <FinishDialog
        open={finishOpen}
        onOpenChange={setFinishOpen}
        session={session}
        entries={entries}
        units={units}
        onConfirm={finish}
        busy={finishing}
      />
    </>
  );
}