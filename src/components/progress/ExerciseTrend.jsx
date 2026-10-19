// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getExerciseTrend } from "@/lib/progress-fns";
import { weekLabel } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { weightUnit } from "@/lib/units";

function TrendTooltip({ active, payload, label, unit }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-lift">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Week of {weekLabel(label)}
      </p>
      <p className="figure mt-1 text-sm font-semibold">
        {Math.round(payload[0].value)} {unit}
      </p>
    </div>
  );
}

/** Pick one exercise and follow it week by week. */
export default function ExerciseTrend({ exercises, units }) {
  const [selected, setSelected] = useState(exercises[0]?.name || null);

  const { data, isPending } = useQuery({
    queryKey: ["exercise-trend", selected],
    queryFn: () => getExerciseTrend({ data: { exerciseName: selected } }),
    enabled: Boolean(selected),
  });

  if (exercises.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Log a few sets and your exercises will show up here.
      </p>
    );
  }

  const rows = data || [];
  const chartedByTime = rows.length > 0 && rows.every((row) => !row.volume);
  const dataKey = chartedByTime ? "minutes" : "volume";
  const unit = chartedByTime ? "min" : weightUnit(units);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {exercises.map((exercise) => (
          <button
            key={exercise.name}
            type="button"
            onClick={() => setSelected(exercise.name)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
              selected === exercise.name
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {exercise.name}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="h-44 animate-pulse rounded-xl bg-muted" />
      ) : rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No history for this exercise yet.</p>
      ) : (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="week"
                tickFormatter={weekLabel}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={46}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => (value >= 1000 ? `${Math.round(value / 1000)}k` : value)}
              />
              <Tooltip content={<TrendTooltip unit={unit} />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="hsl(var(--chart-2))"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "hsl(var(--chart-2))", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}