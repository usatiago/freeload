// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import HealthSyncCard from "@/components/profile/HealthSyncCard";
import AppearanceCard from "@/components/profile/AppearanceCard";
import LicenseCard from "@/components/profile/LicenseCard";
import { getProfile, saveProfile } from "@/lib/profile-fns";
import { ageFromBirthDate } from "@/lib/dates";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/_authed/settings")({
  ssr: false,
  loader: () => getProfile(),
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const profile = Route.useLoaderData();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [saving, setSaving] = useState(false);

  const age = ageFromBirthDate(profile?.birth_date);

  const save = async (values) => {
    setSaving(true);
    try {
      await saveProfile({ data: values });
      await router.invalidate();
      toast.success("Profile saved");
    } catch {
      toast.error("Could not save your profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title={user?.full_name || "Settings"}
        description={
          age ? `${age} years old · signed in as ${user?.email || ""}` : `Signed in as ${user?.email || ""}`
        }
      />

      <div className="space-y-6">
        <section className="panel animate-fade-up p-5">
          <h2 className="mb-1 font-display text-base font-semibold tracking-tight">Your measurements</h2>
          <p className="mb-5 text-xs text-muted-foreground">
            Used for your profile now, and to keep your Google Health record in step later.
          </p>
          <ProfileForm profile={profile} onSave={save} saving={saving} />
        </section>

        <HealthSyncCard profile={profile} />
        <AppearanceCard />
        <LicenseCard />

        <section className="panel animate-fade-up p-5">
          <h2 className="mb-4 font-display text-base font-semibold tracking-tight">Account</h2>
          <Button variant="outline" onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </section>
      </div>
    </>
  );
}