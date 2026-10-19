// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="panel flex flex-col items-center px-6 py-14 text-center animate-fade-up">
      {Icon ? (
        <span className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}