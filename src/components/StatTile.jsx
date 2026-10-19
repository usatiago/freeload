// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

export default function StatTile({ label, value, unit, hint }) {
  return (
    <div className="panel px-4 py-4">
      <p className="label-micro">{label}</p>
      <p className="mt-2.5 flex items-baseline gap-1.5">
        <span className="figure text-2xl font-semibold leading-none">{value}</span>
        {unit ? <span className="text-xs font-medium text-muted-foreground">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}