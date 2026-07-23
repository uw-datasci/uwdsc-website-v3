"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipStatus } from "@/lib/api/profile";
import { useActiveTimeTracker } from "@/hooks/useActiveTimeTracker";

export function ActiveTimeTracker() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const canTrack = !isLoading && isAuthenticated && user !== null;

  useEffect(() => {
    if (!canTrack) {
      setMembershipId(null);
      return;
    }

    let cancelled = false;

    getMembershipStatus()
      .then((status) => {
        if (cancelled) return;
        setMembershipId(status.has_membership ? status.membership_id : null);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to fetch membership for active time tracking:", error);
        setMembershipId(null);
      });

    return () => {
      cancelled = true;
    };
  }, [canTrack]);

  useActiveTimeTracker({
    enabled: canTrack && membershipId !== null,
    membershipId,
  });

  return null;
}
