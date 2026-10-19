// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

export default function PageHeader({ eyebrow, title, description, actions, children }) {
  return (
    <header className="mb-8 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-4">
        <div className="min-w-0">
          {eyebrow ? <p className="label-micro mb-2">{eyebrow}</p> : null}
          <h1 className="font-display text-[1.75rem] font-semibold leading-[1.1] tracking-tight lg:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}