// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { Link, createFileRoute, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { ChevronLeft, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PageHeader from "@/components/PageHeader";
import RoutineExerciseList from "@/components/workouts/RoutineExerciseList";
import { deleteRoutine, getRoutine } from "@/lib/routine-fns";
import { startSession } from "@/lib/session-fns";
import { getProfile } from "@/lib/profile-fns";

export const Route = createFileRoute("/_authed/workouts/$routineId")({
  ssr: false,
  loader: async ({ params }) => {
    const [routine, profile] = await Promise.all([
      getRoutine({ data: { id: params.routineId } }),
      getProfile(),
    ]);
    if (!routine) throw notFound();
    return { routine, units: profile?.units || "imperial" };
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.routine?.name || "Workout" }] }),
  component: RoutineDetailPage,
});

function RoutineDetailPage() {
  const { routine, units } = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const start = async () => {
    setStarting(true);
    try {
      const session = await startSession({ data: { routineId: routine.id } });
      navigate({ to: "/sessions/$sessionId", params: { sessionId: session.id } });
    } catch {
      toast.error("Could not start this workout");
      setStarting(false);
    }
  };

  const remove = async () => {
    await deleteRoutine({ data: { id: routine.id } });
    await router.invalidate();
    navigate({ to: "/workouts" });
  };

  return (
    <>
      <Link
        to="/workouts"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Workouts
      </Link>

      <PageHeader
        eyebrow="Saved workout"
        title={routine.name}
        description={routine.description || undefined}
        actions={
          <>
            <Button onClick={start} disabled={starting}>
              <Play className="h-4 w-4" />
              {starting ? "Starting…" : "Start"}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/workouts/$routineId/edit" params={{ routineId: routine.id }}>
                Edit
              </Link>
            </Button>
          </>
        }
      />

      <RoutineExerciseList exercises={routine.exercises || []} units={units} />

      <div className="mt-10 flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Trash2 className="h-3.5 w-3.5" />
              Delete workout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete “{routine.name}”?</AlertDialogTitle>
              <AlertDialogDescription>
                The workout is removed from your library. Workouts you already logged with it stay in
                your history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}