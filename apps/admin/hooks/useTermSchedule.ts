"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Term } from "@uwdsc/common/types";
import { getActiveTerm, updateActiveTermSchedule } from "@/lib/api/terms";
import type { TermScheduleFormValues } from "@/lib/schemas/termSchedule";

export type TermScheduleLoadState =
  | { status: "loading" }
  | { status: "forbidden"; message: string }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "ready"; term: Term };

export function useTermSchedule() {
  const [loadState, setLoadState] = useState<TermScheduleLoadState>({
    status: "loading",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoadState({ status: "loading" });
    try {
      const term = await getActiveTerm();
      setLoadState(term ? { status: "ready", term } : { status: "empty" });
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      const message =
        err instanceof Error ? err.message : "Failed to load the application schedule";
      if (status === 401) {
        setLoadState({
          status: "forbidden",
          message: "Only Presidents can manage application settings.",
        });
        return;
      }
      setLoadState({ status: "error", message });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Saves the schedule and syncs the load state from the persisted (possibly
   * DB-clamped) row -- never optimistic, since the trigger may adjust the
   * hard deadline. Rethrows on failure so the form can stay dirty.
   */
  const save = useCallback(async (values: TermScheduleFormValues) => {
    setSaving(true);
    try {
      const term = await updateActiveTermSchedule(values);
      setLoadState({ status: "ready", term });
      toast.success("Application schedule updated");
      return term;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return { loadState, load, save, saving };
}
