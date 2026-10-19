// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { HeartPulse } from "lucide-react";
import PreferenceRow from "@/components/profile/PreferenceRow";
import { setHealthSync } from "@/lib/profile-fns";

/**
 * The Google Health switch. Turning it on records the preference; the connection
 * itself still needs OAuth credentials from your own Google Cloud project, so the
 * card says what is required rather than pretending it is already connected.
 */
export default function HealthSyncCard({ profile }) {
  const router = useRouter();
  const save = useServerFn(setHealthSync);
  const [enabled, setEnabled] = useState(Boolean(profile?.google_health_enabled));
  const [saving, setSaving] = useState(false);

  const rows = [
    { label: "Age", value: profile?.birth_date ? "From your birth date" : "Add your birth date" },
    { label: "Height", value: profile?.height_cm == null ? "Not set" : "Saved in your profile" },
    { label: "Weight", value: profile?.weight_kg == null ? "Not set" : "Saved in your profile" },
  ];

  const toggle = async (next) => {
    setEnabled(next);
    setSaving(true);
    try {
      await save({ data: { enabled: next } });
      await router.invalidate();
      toast.success(next ? "Google Health sync on" : "Google Health sync off");
    } catch {
      setEnabled(!next);
      toast.error("Could not change the Google Health setting");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel animate-fade-up overflow-hidden">
      <header className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground">
          <HeartPulse className="h-4 w-4" />
        </span>
        <div>
          <p className="font-display text-base font-semibold tracking-tight">Google Health</p>
          <p className="text-xs text-muted-foreground">{enabled ? "Sync on" : "Sync off"}</p>
        </div>
      </header>

      <div className="space-y-4 px-5 py-4">
        <PreferenceRow
          icon={HeartPulse}
          title="Sync to Google Health"
          description="Send finished workouts to your Google Health record and keep your age, height and weight in step."
          checked={enabled}
          onCheckedChange={toggle}
          disabled={saving}
        />

        <p className="text-sm leading-relaxed text-muted-foreground">
          The connection itself needs OAuth credentials from a Google Cloud project you own, with the
          Health API enabled — that part is set up separately.
        </p>

        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}