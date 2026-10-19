// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { weekLabel } from "@/lib/dates";

function ChartTooltip({ active, payload, label, unit }) {
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

/** Volume moved each week. */
export default function VolumeChart({ data, units }) {
  if (!data || data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Finish a workout to start charting your volume.
      </p>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
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
          <Tooltip content={<ChartTooltip unit={units} />} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[6, 6, 6, 6]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}