// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { Link, createFileRoute, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import ExercisePickerDialog from "@/components/ExercisePickerDialog";
import RoutineExerciseRow from "@/components/workouts/RoutineExerciseRow";
import { createExercise, listCustomExercises } from "@/lib/exercise-fns";
import { getProfile } from "@/lib/profile-fns";
import { getRoutine, updateRoutine } from "@/lib/routine-fns";
import { mergeExercises } from "@/lib/exerciseCatalog";
import { distanceFromDisplay, distanceToDisplay, weightFromDisplay, weightToDisplay } from "@/lib/units";

/**
 * Target weights and distances are edited in the user's own units. The original
 * stored values are kept alongside so that saving without touching a field never
 * nudges the number (135 lb must stay 135 lb, not 134.9).
 */
function toEditor(item, units) {
  const weightDisplay = item.target_weight == null ? null : weightToDisplay(item.target_weight, units);
  const distanceDisplay = item.target_distance == null ? null : distanceToDisplay(item.target_distance, units);
  return {
    exercise_id: item.exercise_id,
    exercise_name: item.exercise_name,
    category: item.category || "strength",
    target_sets: item.target_sets ?? null,
    target_reps: item.target_reps ?? null,
    target_minutes: item.target_minutes ?? null,
    target_weight: weightDisplay,
    target_distance: distanceDisplay,
    stored_weight: item.target_weight ?? null,
    stored_distance: item.target_distance ?? null,
    original_weight: weightDisplay,
    original_distance: distanceDisplay,
  };
}

function fromEditor(item, units) {
  return {
    exercise_id: item.exercise_id,
    exercise_name: item.exercise_name,
    category: item.category,
    target_sets: item.target_sets,
    target_reps: item.target_reps,
    target_minutes: item.target_minutes,
    target_weight:
      item.target_weight === item.original_weight
        ? item.stored_weight
        : item.target_weight == null
          ? null
          : weightFromDisplay(item.target_weight, units),
    target_distance:
      item.target_distance === item.original_distance
        ? item.stored_distance
        : item.target_distance == null
          ? null
          : distanceFromDisplay(item.target_distance, units),
  };
}

export const Route = createFileRoute("/_authed/workouts/$routineId_/edit")({
  ssr: false,
  loader: async ({ params }) => {
    const [routine, custom, profile] = await Promise.all([
      getRoutine({ data: { id: params.routineId } }),
      listCustomExercises(),
      getProfile(),
    ]);
    if (!routine) throw notFound();
    const units = profile?.units || "imperial";
    return {
      name: routine.name,
      description: routine.description || "",
      exercises: (routine.exercises || []).map((item) => toEditor(item, units)),
      library: mergeExercises(custom),
      units,
    };
  },
  head: () => ({ meta: [{ title: "Edit workout" }] }),
  component: EditRoutinePage,
});

function EditRoutinePage() {
  const loaded = Route.useLoaderData();
  const { routineId } = Route.useParams();
  const { units, library } = loaded;

  const router = useRouter();
  const navigate = useNavigate();
  const [name, setName] = useState(loaded.name);
  const [description, setDescription] = useState(loaded.description);
  const [exercises, setExercises] = useState(loaded.exercises);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const addExercise = (exercise) => {
    setExercises((list) => [
      ...list,
      toEditor(
        {
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          category: exercise.category,
          target_sets: 3,
          target_reps: exercise.category === "strength" ? 10 : null,
        },
        units,
      ),
    ]);
  };

  const patch = (index, changes) =>
    setExercises((list) => list.map((item, i) => (i === index ? { ...item, ...changes } : item)));

  const move = (index, direction) =>
    setExercises((list) => {
      const next = [...list];
      const target = index + direction;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const save = async () => {
    setSaving(true);
    try {
      await updateRoutine({
        data: {
          id: routineId,
          name: name.trim() || "New workout",
          description,
          exercises: exercises.map((item) => fromEditor(item, units)),
        },
      });
      await router.invalidate();
      navigate({ to: "/workouts/$routineId", params: { routineId } });
    } catch {
      toast.error("Could not save this workout");
      setSaving(false);
    }
  };

  return (
    <>
      <Link
        to="/workouts/$routineId"
        params={{ routineId }}
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <PageHeader
        eyebrow="Build"
        title="Edit workout"
        actions={
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save workout"}
          </Button>
        }
      />

      <div className="panel mb-6 space-y-4 p-5">
        <div className="space-y-2">
          <Label className="label-micro">Workout name</Label>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Push day"
            className="h-12 font-display text-base font-medium"
          />
        </div>
        <div className="space-y-2">
          <Label className="label-micro">Description</Label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional — what this workout is for"
          />
        </div>
      </div>

      {exercises.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No exercises yet"
          description="Add the exercises you want in this workout and set the targets you're aiming for."
          action={
            <Button onClick={() => setPickerOpen(true)}>
              <Plus className="h-4 w-4" />
              Add exercise
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {exercises.map((item, index) => (
              <RoutineExerciseRow
                key={`${item.exercise_id}-${index}`}
                item={item}
                index={index}
                total={exercises.length}
                units={units}
                onPatch={(changes) => patch(index, changes)}
                onMove={(direction) => move(index, direction)}
                onRemove={() => setExercises((list) => list.filter((_, i) => i !== index))}
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
        onSelect={addExercise}
        onCreate={(values) => createExercise({ data: values })}
      />
    </>
  );
}