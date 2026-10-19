// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { useNavigate, useRouter, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import RoutineCard from "@/components/workouts/RoutineCard";
import { createRoutine, listRoutines } from "@/lib/routine-fns";

export const Route = createFileRoute("/_authed/workouts/")({
  ssr: false,
  loader: () => listRoutines(),
  head: () => ({ meta: [{ title: "Workouts" }] }),
  component: WorkoutsPage,
});

function WorkoutsPage() {
  const routines = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const startNew = async () => {
    setCreating(true);
    try {
      const routine = await createRoutine({ data: { name: "New workout" } });
      await router.invalidate();
      navigate({ to: "/workouts/$routineId/edit", params: { routineId: routine.id } });
    } catch {
      toast.error("Could not create the workout");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Workouts"
        description="Saved workouts you can start any time, with the exercises and targets you set."
        actions={
          routines.length > 0 ? (
            <Button onClick={startNew} disabled={creating}>
              <Plus className="h-4 w-4" />
              {creating ? "Creating…" : "New workout"}
            </Button>
          ) : null
        }
      />

      {routines.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No saved workouts yet"
          description="Build one once — the exercises and target sets, reps and weights — then start it whenever you train."
          action={
            <Button onClick={startNew} disabled={creating}>
              {creating ? "Creating…" : "Create your first workout"}
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      )}
    </>
  );
}