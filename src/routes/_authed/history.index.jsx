// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useMemo } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Dumbbell, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import SessionRow from "@/components/history/SessionRow";
import { listSessions } from "@/lib/session-fns";
import { getProfile } from "@/lib/profile-fns";
import { formatDayHeading } from "@/lib/dates";

export const Route = createFileRoute("/_authed/history/")({
  ssr: false,
  loader: async () => {
    const [sessions, profile] = await Promise.all([
      listSessions({ data: { limit: 60 } }),
      getProfile(),
    ]);
    return { sessions, units: profile?.units || "imperial" };
  },
  head: () => ({ meta: [{ title: "History" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { sessions, units } = Route.useLoaderData();

  const months = useMemo(() => {
    const grouped = new Map();
    sessions.forEach((session) => {
      const key = formatDayHeading(session.started_at);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(session);
    });
    return [...grouped.entries()];
  }, [sessions]);

  return (
    <>
      <PageHeader
        eyebrow="Training log"
        title="History"
        description={
          sessions.length > 0
            ? `${sessions.length} finished workout${sessions.length === 1 ? "" : "s"}, newest first.`
            : undefined
        }
      />

      {sessions.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="Nothing logged yet"
          description="Finish a workout and every set you logged lands here, ready to look back on."
          action={
            <Button asChild>
              <Link to="/">
                <Play className="h-4 w-4" />
                Start a workout
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {months.map(([month, items]) => (
            <section key={month} className="animate-fade-up">
              <h2 className="label-micro mb-3">{month}</h2>
              <div className="space-y-3">
                {items.map((session) => (
                  <SessionRow key={session.id} session={session} units={units} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}