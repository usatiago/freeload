// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import useElapsed from "@/hooks/useElapsed";
import { formatClock } from "@/lib/dates";

export default function SessionTimer({ startedAt, active = true }) {
  const seconds = useElapsed(startedAt, active);
  return (
    <span className="figure text-sm font-semibold leading-none">{formatClock(seconds)}</span>
  );
}