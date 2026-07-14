"use client";

import { useCallback, useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@uwdsc/db";

const HEARTBEAT_INTERVAL_MS = 60_000;

function isTabVisible(): boolean {
  return typeof document !== "undefined" && document.visibilityState === "visible";
}

export interface UseActiveTimeTrackerOptions {
  readonly enabled: boolean;
  readonly membershipId: string | null;
}

export function useActiveTimeTracker({
  enabled,
  membershipId,
}: UseActiveTimeTrackerOptions): void {
  const pendingSecondsRef = useRef(0);
  const countingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSyncingRef = useRef(false);
  const membershipIdRef = useRef(membershipId);
  membershipIdRef.current = membershipId;

  const clearCountingInterval = useCallback(() => {
    if (countingIntervalRef.current !== null) {
      clearInterval(countingIntervalRef.current);
      countingIntervalRef.current = null;
    }
  }, []);

  const startCountingInterval = useCallback(() => {
    if (!enabled || !isTabVisible() || countingIntervalRef.current !== null) return;

    countingIntervalRef.current = setInterval(() => {
      pendingSecondsRef.current += 1;
    }, 1000);
  }, [enabled]);

  const syncPendingSeconds = useCallback(async () => {
    if (isSyncingRef.current) return;

    isSyncingRef.current = true;

    try {
      const currentMembershipId = membershipIdRef.current;
      if (!currentMembershipId) return;

      const seconds = pendingSecondsRef.current;
      if (seconds <= 0) return;

      pendingSecondsRef.current -= seconds;

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.rpc("increment_membership_active_time", {
        p_membership_id: currentMembershipId,
        p_seconds: seconds,
      });

      if (error) {
        pendingSecondsRef.current += seconds;
        console.error("Failed to sync active time:", error);
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearCountingInterval();
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startCountingInterval();
      } else {
        clearCountingInterval();
      }
    };

    if (isTabVisible()) {
      startCountingInterval();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearCountingInterval();
    };
  }, [enabled, clearCountingInterval, startCountingInterval]);

  useEffect(() => {
    if (!enabled || !membershipId) return;

    const heartbeat = setInterval(() => {
      void syncPendingSeconds();
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      clearInterval(heartbeat);
    };
  }, [enabled, membershipId, syncPendingSeconds]);
}
