// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Link } from "@tanstack/react-router";

export default function Wordmark() {
  return (
    <Link to="/" className="inline-flex items-baseline">
      <span className="font-display text-lg font-semibold uppercase leading-none tracking-[0.16em]">
        free
      </span>
      <span className="font-display text-lg font-semibold uppercase leading-none tracking-[0.16em] text-primary">
        Load
      </span>
    </Link>
  );
}