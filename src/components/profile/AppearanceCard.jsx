// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { Moon } from "lucide-react";
import PreferenceRow from "@/components/profile/PreferenceRow";
import { useTheme } from "@/lib/ThemeContext";

export default function AppearanceCard() {
  const { dark, setDark } = useTheme();

  return (
    <section className="panel animate-fade-up p-5">
      <h2 className="mb-1 font-display text-base font-semibold tracking-tight">Appearance</h2>
      <p className="mb-5 text-xs text-muted-foreground">Kept on this device.</p>
      <PreferenceRow
        icon={Moon}
        title="Dark mode"
        description="Use the dark palette across the whole app."
        checked={dark}
        onCheckedChange={setDark}
      />
    </section>
  );
}