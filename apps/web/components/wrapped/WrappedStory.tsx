"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@uwdsc/ui/lib/utils";
import { WRAPPED_SLIDES } from "./slides";
import { WrappedSlide } from "./slides/WrappedSlide";
import { useStoryTimer } from "./useStoryTimer";
import { DEFAULT_SLIDE_DURATION_MS, type WrappedSlideData } from "./types";

interface WrappedStoryProps {
  /**
   * Slides to play. Defaults to the placeholder set so the modal works
   * standalone today; pass DB-driven data here once it's wired up.
   */
  readonly slides?: readonly WrappedSlideData[];
  /** Whether the story is currently visible — used to reset to slide 0 on open. */
  readonly active?: boolean;
}

// Direction-aware horizontal slide, mirroring the apply-flow convention.
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

// Below this hold duration a press counts as a tap (skip); at or above it the
// press is treated as a press-and-hold (pause).
const HOLD_THRESHOLD_MS = 200;
// How long the control hints linger before fading out on their own.
const HINT_VISIBLE_MS = 4000;

export function WrappedStory({
  slides = WRAPPED_SLIDES,
  active = true,
}: WrappedStoryProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showHints, setShowHints] = useState(true);

  const count = slides.length;

  // Restart the story whenever it (re)opens.
  useEffect(() => {
    if (active) {
      setIndex(0);
      setDirection(1);
      setPaused(false);
      setShowHints(true);
    }
  }, [active]);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= count) return;
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [count, index],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  const slide = slides[index];

  // Timer drives both auto-advance and the active progress-bar segment.
  const progress = useStoryTimer({
    active,
    paused,
    durationMs: slide?.durationMs ?? DEFAULT_SLIDE_DURATION_MS,
    slideKey: slide?.id ?? "",
    onComplete: goNext,
  });

  // Auto-hide the control hints after the first few seconds.
  useEffect(() => {
    if (!active || !showHints) return;
    const t = window.setTimeout(() => setShowHints(false), HINT_VISIBLE_MS);
    return () => window.clearTimeout(t);
  }, [active, showHints]);

  // Keyboard: arrows navigate, space toggles pause/play.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goNext, goPrev]);

  // Press-and-hold detection for the tap zones. A short press skips; holding
  // past the threshold pauses until release.
  const holdTimer = useRef<number | null>(null);
  const isHolding = useRef(false);

  const handlePointerDown = useCallback(() => {
    isHolding.current = false;
    holdTimer.current = window.setTimeout(() => {
      isHolding.current = true;
      setPaused(true);
    }, HOLD_THRESHOLD_MS);
  }, []);

  const endPress = useCallback((navigate?: () => void) => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (isHolding.current) {
      // Was a hold — release just resumes, never navigates.
      isHolding.current = false;
      setPaused(false);
    } else {
      navigate?.();
    }
  }, []);

  if (count === 0 || !slide) return null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Progress bar — one segment per slide, story-style. The active segment
          fills with the live timer progress; others are full/empty. */}
      <div className="absolute top-3 right-3 left-3 z-20 flex gap-1.5">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <div
              className={cn(
                "h-full rounded-full bg-white",
                i !== index && "transition-[width] duration-300",
              )}
              style={{
                width:
                  i < index
                    ? "100%"
                    : i === index
                      ? `${progress * 100}%`
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Play/pause toggle, media-control style. */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play" : "Pause"}
        className="absolute top-4 left-4 z-30 flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus:outline-none"
      >
        {paused ? (
          <Play className="size-4 fill-current" />
        ) : (
          <Pause className="size-4 fill-current" />
        )}
      </button>

      {/* Animated slide. One slide mounted at a time (mode="wait"). */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <WrappedSlide slide={slide} />
        </motion.div>
      </AnimatePresence>

      {/* Centered pause flash, like Instagram/YouTube when a story is held. */}
      <AnimatePresence>
        {paused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <Play className="size-7 fill-white text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible tap zones: left third = back, right two-thirds = forward.
          Pointer handlers distinguish a tap (skip) from a hold (pause). */}
      <button
        type="button"
        aria-label="Previous slide"
        onPointerDown={handlePointerDown}
        onPointerUp={() => endPress(goPrev)}
        onPointerLeave={() => endPress()}
        onPointerCancel={() => endPress()}
        className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-default focus:outline-none"
      />
      <button
        type="button"
        aria-label="Next slide"
        onPointerDown={handlePointerDown}
        onPointerUp={() => endPress(goNext)}
        onPointerLeave={() => endPress()}
        onPointerCancel={() => endPress()}
        className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-default focus:outline-none"
      />

      {/* Control hints — gesture + keybind. Auto-fades, returns while paused. */}
      <AnimatePresence>
        {(showHints || paused) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-4"
          >
            <p className="rounded-full bg-black/40 px-3 py-1.5 text-center text-xs text-white/90 backdrop-blur-sm">
              Tap to skip · Hold to pause ·{" "}
              <kbd className="font-sans font-semibold">Space</kbd> to play/pause
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
