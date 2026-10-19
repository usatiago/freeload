// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Download, Scale } from "lucide-react";

const LICENCE_LINES = [
  "This app is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.",
  "It is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.",
  "Every source file carries an SPDX licence header, and the full notice lives in the LICENSE file at the root of the repository.",
];

export default function LicenseCard() {
  return (
    <div className="panel animate-fade-up overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground">
          <Scale className="h-4 w-4" />
        </span>
        <div>
          <p className="font-display text-base font-semibold tracking-tight">Open source</p>
          <p className="text-xs text-muted-foreground">GNU GPL v3.0 or later</p>
        </div>
      </header>

      <div className="space-y-3 px-5 py-4">
        {LICENCE_LINES.map((line) => (
          <p key={line} className="text-sm leading-relaxed text-muted-foreground">
            {line}
          </p>
        ))}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.html"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Read the full licence
          </a>
          <a
            href="/freeLoad-source.zip"
            download="freeLoad-source.zip"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            <Download className="h-3.5 w-3.5" />
            Download the source (.zip)
          </a>
        </div>
      </div>
    </div>
  );
}