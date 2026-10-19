// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { categoryLabel, isTimed } from "@/lib/exerciseCatalog";
import { formatClock, formatDate } from "@/lib/dates";
import { distanceToDisplay, distanceUnit, round1, weightToDisplay, weightUnit } from "@/lib/units";
import { isLoggedSet } from "@/lib/loggedSets";

function setSummary(set, category, units) {
  if (isTimed(category)) {
    const minutes = set.minutes ?? 0;
    const distance = set.distance ? ` · ${distanceToDisplay(set.distance, units)} ${distanceUnit(units)}` : "";
    return `${minutes} min${distance}`;
  }
  return `${set.reps ?? 0} × ${weightToDisplay(set.weight, units) ?? 0} ${weightUnit(units)}`;
}

/** Read-only view of a finished workout. */
export default function SessionSummary({ session, units }) {
  const entries = session.entries || [];
  const volume = units === "imperial" ? round1((session.total_volume || 0) * 2.20462262) : Math.round(session.total_volume || 0);

  return (
    <div className="space-y-6">
      <div className="panel animate-fade-up grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
        {[
          { label: "Date", value: formatDate(session.started_at, { year: undefined }) },
          { label: "Duration", value: formatClock(session.duration_seconds) },
          { label: "Sets", value: String(session.total_sets || 0) },
          { label: `Volume (${weightUnit(units)})`, value: String(volume) },
        ].map((stat) => (
          <div key={stat.label} className="border-b border-border px-4 py-4 last:border-b-0 sm:border-b-0">
            <p className="label-micro">{stat.label}</p>
            <p className="figure mt-2 text-lg font-semibold leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      {session.notes ? (
        <div className="panel animate-fade-up px-5 py-4">
          <p className="label-micro mb-2">Notes</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{session.notes}</p>
        </div>
      ) : null}

      <div className="space-y-3">
        {entries.map((entry, index) => {
          const logged = (entry.sets || []).filter(isLoggedSet);
          return (
            <section key={index} className="panel animate-fade-up overflow-hidden">
              <header className="flex items-center gap-3 border-b border-border px-4 py-3">
                <span className="figure text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium leading-tight">{entry.exercise_name}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {categoryLabel(entry.category)} · {logged.length} set{logged.length === 1 ? "" : "s"}
                  </p>
                </div>
              </header>
              <ul className="divide-y divide-border">
                {logged.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-muted-foreground">No sets logged.</li>
                ) : (
                  logged.map((set, setIndex) => (
                    <li key={setIndex} className="flex items-center gap-4 px-4 py-2.5 text-sm">
                      <span className="figure w-6 text-center text-xs text-muted-foreground">
                        {setIndex + 1}
                      </span>
                      <span className="figure font-medium">{setSummary(set, entry.category, units)}</span>
                    </li>
                  ))
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}