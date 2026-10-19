// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatTile from "@/components/StatTile";
import VolumeChart from "@/components/progress/VolumeChart";
import ExerciseTrend from "@/components/progress/ExerciseTrend";
import {
  getExerciseTrend,
  getLifetimeStats,
  getTopExercises,
  getWeekStats,
  getWeeklyVolume,
} from "@/lib/progress-fns";
import { getProfile } from "@/lib/profile-fns";
import { formatDuration } from "@/lib/dates";
import { round1, weightUnit } from "@/lib/units";

export const Route = createFileRoute("/_authed/progress")({
  ssr: false,
  loader: async () => {
    const [week, lifetime, weekly, top, profile] = await Promise.all([
      getWeekStats(),
      getLifetimeStats(),
      getWeeklyVolume(),
      getTopExercises(),
      getProfile(),
    ]);
    return { week, lifetime, weekly, top, units: profile?.units || "imperial" };
  },
  head: () => ({ meta: [{ title: "Progress" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const { week, lifetime, weekly, top, units } = Route.useLoaderData();

  const inDisplay = (kg) => (units === "imperial" ? round1(kg * 2.20462262) : Math.round(kg));
  const unit = weightUnit(units);
  const chartData = weekly.map((row) => ({ ...row, volume: inDisplay(row.volume) }));

  const empty = lifetime.sessions === 0;

  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="How you're tracking"
        description={
          empty
            ? undefined
            : `${lifetime.sessions} workouts · ${lifetime.sets} sets · ${formatDuration(lifetime.seconds)} all time.`
        }
      />

      {empty ? (
        <EmptyState
          icon={TrendingUp}
          title="No progress to chart yet"
          description="Once you finish a workout, your weekly volume and each exercise's trend appear here."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile label="This week" value={week.sessions} unit="workouts" />
            <StatTile label="Volume" value={inDisplay(week.volume)} unit={unit} hint="Reps × weight this week" />
            <StatTile label="Time" value={formatDuration(week.seconds)} hint="Training time this week" />
          </div>

          <section className="panel animate-fade-up p-5">
            <h2 className="font-display text-base font-semibold tracking-tight">Volume by week</h2>
            <p className="mt-1 mb-4 text-xs text-muted-foreground">
              Total weight moved each week, in {unit}.
            </p>
            <VolumeChart data={chartData} units={unit} />
          </section>

          <section className="panel animate-fade-up p-5">
            <h2 className="font-display text-base font-semibold tracking-tight">Exercise trends</h2>
            <p className="mt-1 mb-4 text-xs text-muted-foreground">
              Follow one exercise week by week — volume for weights, minutes for timed work.
            </p>
            <ExerciseTrend exercises={top} units={units} />
          </section>
        </div>
      )}
    </>
  );
}