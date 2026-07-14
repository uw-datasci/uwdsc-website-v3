"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipStatus } from "@/lib/api/profile";
import { useActiveTimeTracker } from "@/hooks/useActiveTimeTracker";

export function ActiveTimeTracker() {
  const { isAuthenticated } = useAuth();
  const [membershipId, setMembershipId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
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
  }, [isAuthenticated]);

  useActiveTimeTracker({
    enabled: isAuthenticated && membershipId !== null,
    membershipId,
  });

  return null;
}
