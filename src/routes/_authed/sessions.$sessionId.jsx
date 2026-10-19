// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { createFileRoute, notFound } from "@tanstack/react-router";
import ActiveSession from "@/components/session/ActiveSession";
import CompletedSession from "@/components/session/CompletedSession";
import { listCustomExercises } from "@/lib/exercise-fns";
import { mergeExercises } from "@/lib/exerciseCatalog";
import { getProfile } from "@/lib/profile-fns";
import { getSession } from "@/lib/session-fns";

export const Route = createFileRoute("/_authed/sessions/$sessionId")({
  ssr: false,
  loader: async ({ params }) => {
    const [session, custom, profile] = await Promise.all([
      getSession({ data: { id: params.sessionId } }),
      listCustomExercises(),
      getProfile(),
    ]);
    if (!session) throw notFound();
    return {
      session,
      library: mergeExercises(custom),
      units: profile?.units || "imperial",
    };
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.session?.name || "Workout" }] }),
  component: SessionPage,
});

function SessionPage() {
  const { session, library, units } = Route.useLoaderData();
  return session.status === "completed" ? (
    <CompletedSession session={session} units={units} />
  ) : (
    <ActiveSession session={session} library={library} units={units} />
  );
}