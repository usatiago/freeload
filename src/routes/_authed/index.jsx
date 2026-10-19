// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import StatTile from "@/components/StatTile";
import QuickStartCard from "@/components/home/QuickStartCard";
import SavedWorkoutList from "@/components/home/SavedWorkoutList";
import ResumeCard from "@/components/home/ResumeCard";
import SessionRow from "@/components/history/SessionRow";
import { getProfile } from "@/lib/profile-fns";
import { getWeekStats } from "@/lib/progress-fns";
import { listRoutines } from "@/lib/routine-fns";
import { getActiveSession, listSessions, startSession } from "@/lib/session-fns";
import { useAuth } from "@/lib/AuthContext";
import { formatDuration } from "@/lib/dates";
import { round1, weightUnit } from "@/lib/units";

export const Route = createFileRoute("/_authed/")({
  ssr: false,
  loader: async () => {
    const [active, routines, sessions, week, profile] = await Promise.all([
      getActiveSession(),
      listRoutines(),
      listSessions({ data: { limit: 6 } }),
      getWeekStats(),
      getProfile(),
    ]);
    return { active, routines, sessions, week, units: profile?.units || "imperial" };
  },
  head: () => ({ meta: [{ title: "Home" }] }),
  component: HomePage,
});

function greetingFor(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  const { active, routines, sessions, week, units } = Route.useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(null);

  const now = new Date();
  const firstName = (user?.full_name || "").trim().split(" ")[0] || "there";
  const today = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const begin = async (routineId) => {
    setPending(routineId || "empty");
    try {
      const session = await startSession({ data: routineId ? { routineId } : {} });
      navigate({ to: "/sessions/$sessionId", params: { sessionId: session.id } });
    } catch {
      toast.error("Could not start the workout");
      setPending(null);
    }
  };

  const volume = units === "imperial" ? round1((week.volume || 0) * 2.20462262) : Math.round(week.volume || 0);

  return (
    <>
      <header className="mb-8 animate-fade-up">
        <p className="label-micro mb-2">{today}</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
          {greetingFor(now.getHours())}, {firstName}
        </h1>
      </header>

      {active ? <ResumeCard session={active} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <QuickStartCard
          onStart={() => begin(null)}
          busy={pending === "empty"}
          disabled={Boolean(active)}
        />
        <SavedWorkoutList
          routines={routines}
          onStart={begin}
          pendingId={pending}
          disabled={Boolean(active)}
        />
      </div>

      {active ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Finish your workout in progress before starting another one.
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="label-micro mb-3">This week</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Workouts" value={week.sessions} />
          <StatTile label="Volume" value={volume} unit={weightUnit(units)} />
          <StatTile label="Time" value={formatDuration(week.seconds)} />
        </div>
      </section>

      {sessions.length > 0 ? (
        <section className="mt-10">
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="label-micro">Recent workouts</h2>
            <Link
              to="/history"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              All history
            </Link>
          </div>
          <div className="space-y-3">
            {sessions.slice(0, 3).map((session) => (
              <SessionRow key={session.id} session={session} units={units} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <Link
          to="/exercises"
          className="flex items-center justify-between gap-4 rounded-[var(--radius)] border border-dashed border-border px-5 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <span>Looking for a different exercise? Manage your own library.</span>
          <span className="shrink-0 font-medium text-primary">Exercises</span>
        </Link>
      </section>
    </>
  );
}