"use client";

import { useEffect, useState } from "react";
import { GlassSurface } from "@uwdsc/ui";
import { formatTermCode } from "@uwdsc/common/utils";
import { useApplyWindow } from "@/hooks/useApplyWindow";
import { useCountdown } from "@/hooks/useCountdown";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * "Applications Open" badge with a live countdown to the soft deadline.
 * Renders nothing while the window is closed, so the hero is unchanged.
 * The window itself stays open through the hard deadline -- once the soft
 * (advertised) deadline passes, the countdown naturally hits zero and the
 * badge switches to a "closing now" label instead of disappearing.
 */
export function HeroApplyBadge() {
  const { open, softDeadline, termCode } = useApplyWindow();
  const countdown = useCountdown(open ? softDeadline : null);

  // useCountdown also returns null before its effect has run on mount, so a
  // "not counting" state needs a mount flag to tell that apart from "elapsed".
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const inGrace = mounted && open && softDeadline !== null && countdown === null;

  if (!open) return null;

  const label = termCode
    ? `${formatTermCode(termCode)} Applications Open`
    : "Applications Open";

  return (
    // w-fit + mx-auto so the 100%-width GlassSurface hugs its content,
    // matching how the hero CTA pill is built
    <div className="w-fit mx-auto">
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={9999}
        className="px-4 py-2 md:px-6 md:py-3 overflow-visible!"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </span>
            <p className="text-[10px] sm:text-xs text-emerald-300 uppercase tracking-[0.2em] font-bold drop-shadow-sm text-nowrap">
              {label}
            </p>
          </div>

          {countdown && (
            <p className="font-mono text-xs sm:text-sm text-grey1 text-nowrap">
              Closes in {pad(countdown.days)}d {pad(countdown.hours)}h{" "}
              {pad(countdown.minutes)}m {pad(countdown.seconds)}s
            </p>
          )}
          {inGrace && (
            <p className="font-mono text-xs sm:text-sm text-grey1 text-nowrap">
              Closing now — final submissions
            </p>
          )}
        </div>
      </GlassSurface>
    </div>
  );
}
