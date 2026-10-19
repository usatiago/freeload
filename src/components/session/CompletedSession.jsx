// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors
import { useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PageHeader from "@/components/PageHeader";
import SessionSummary from "@/components/session/SessionSummary";
import { deleteSession } from "@/lib/session-fns";

/** A finished workout: the totals, the sets and the notes. */
export default function CompletedSession({ session, units }) {
  const router = useRouter();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      await deleteSession({ data: { id: session.id } });
      await router.invalidate();
      navigate({ to: "/history" });
    } catch {
      toast.error("Could not delete this workout");
      setDeleting(false);
    }
  };

  return (
    <>
      <Link
        to="/history"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        History
      </Link>

      <PageHeader eyebrow="Completed" title={session.name || "Workout"} />

      <SessionSummary session={session} units={units} />

      <div className="mt-10 flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground" disabled={deleting}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete workout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this workout?</AlertDialogTitle>
              <AlertDialogDescription>
                It is removed from your history and from your progress charts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}