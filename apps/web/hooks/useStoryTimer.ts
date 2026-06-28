"use client";

import { useEffect, useRef, useState } from "react";

interface UseStoryTimerOptions {
  /** Whether the story is visible/playing at all (e.g. modal open). */
  readonly active: boolean;
  /** When true, the timer freezes and resumes from where it left off. */
  readonly paused: boolean;
  /** Duration of the current slide in ms. */
  readonly durationMs: number;
  /**
   * Identity of the current slide. Whenever this changes the timer resets to 0
   * — so tapping forward, going back, and auto-advancing all restart the clock.
   */
  readonly slideKey: string;
  /** Called once when the current slide's timer reaches 100%. */
  readonly onComplete: () => void;
}

/**
 * Drives a single slide's auto-advance, returning its progress in `[0, 1]`.
 *
 * Uses `requestAnimationFrame` and accumulates elapsed time so pausing (and
 * resuming) doesn't count the paused interval. The progress value is what the
 * story-style progress bar fills with, so the bar always reflects the timer.
 */
export function useStoryTimer({
  active,
  paused,
  durationMs,
  slideKey,
  onComplete,
}: UseStoryTimerOptions): number {
  const [progress, setProgress] = useState(0);
  const elapsedRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);

  // Reset whenever the slide changes.
  useEffect(() => {
    elapsedRef.current = 0;
    lastTsRef.current = null;
    setProgress(0);
  }, [slideKey]);

  useEffect(() => {
    // While inactive or paused, drop the timestamp anchor so the gap isn't
    // counted as elapsed time when we resume.
    if (!active || paused) {
      lastTsRef.current = null;
      return;
    }

    let frame = 0;
    const tick = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      elapsedRef.current += ts - lastTsRef.current;
      lastTsRef.current = ts;

      const next = durationMs > 0 ? Math.min(1, elapsedRef.current / durationMs) : 1;
      setProgress(next);

      if (next >= 1) {
        // Slide finished. Advancing changes slideKey, which resets us above.
        onComplete();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, paused, durationMs, slideKey, onComplete]);

  return progress;
}
