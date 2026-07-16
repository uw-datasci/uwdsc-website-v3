"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@uwdsc/ui/lib/utils";
import { WRAPPED_SLIDES } from "./slides";
import { WrappedSlide } from "./slides/WrappedSlide";
import type { WrappedSlideData } from "./types";

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

export function WrappedStory({
  slides = WRAPPED_SLIDES,
  active = true,
}: WrappedStoryProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const count = slides.length;

  // Restart the story whenever it (re)opens.
  useEffect(() => {
    if (active) {
      setIndex(0);
      setDirection(1);
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

  // Keyboard navigation (arrow keys).
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goNext, goPrev]);

  if (count === 0) return null;

  const slide = slides[index]!;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Progress bar — one segment per slide, story-style. */}
      <div className="absolute top-3 right-3 left-3 z-20 flex gap-1.5">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <div
              className={cn(
                "h-full rounded-full bg-white transition-[width] duration-300",
                i < index ? "w-full" : i === index ? "w-full" : "w-0",
              )}
            />
          </div>
        ))}
      </div>

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

      {/* Invisible tap zones: left third = back, right two-thirds = forward. */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={goPrev}
        disabled={index === 0}
        className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-default focus:outline-none disabled:cursor-default"
      />
      <button
        type="button"
        aria-label="Next slide"
        onClick={goNext}
        disabled={index === count - 1}
        className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-default focus:outline-none disabled:cursor-default"
      />
    </div>
  );
}
