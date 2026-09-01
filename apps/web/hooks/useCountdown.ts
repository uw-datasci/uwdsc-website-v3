"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Milliseconds remaining. Always > 0 when a countdown is returned. */
  total: number;
}

function remaining(targetMs: number): Countdown | null {
  const total = targetMs - Date.now();
  if (total <= 0) return null;

  const seconds = Math.floor(total / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    total,
  };
}

/**
 * Live countdown to an ISO timestamp, ticking once per second.
 *
 * Returns null until mounted, and whenever the target is missing, unparseable,
 * or already elapsed. Deliberately computes nothing during render — the server
 * has no stable "now", so a render-time value would mismatch on hydration.
 */
export function useCountdown(targetIso: string | null): Countdown | null {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    if (!targetIso) {
      setCountdown(null);
      return;
    }

    const targetMs = Date.parse(targetIso);
    if (Number.isNaN(targetMs)) {
      setCountdown(null);
      return;
    }

    setCountdown(remaining(targetMs));

    const interval = setInterval(() => {
      const next = remaining(targetMs);
      setCountdown(next);
      if (next === null) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetIso]);

  return countdown;
}
