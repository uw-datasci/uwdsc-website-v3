"use client";

import { cn } from "@uwdsc/ui/lib/utils";
import type { WrappedSlideData } from "../types";

interface WrappedSlideProps {
  readonly slide: WrappedSlideData;
}

/**
 * Presentational single slide. Purely renders `WrappedSlideData` — no state,
 * no navigation, no animation (the parent `WrappedStory` owns all of that).
 */
export function WrappedSlide({ slide }: WrappedSlideProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center",
        slide.background,
        slide.foreground ?? "text-white",
      )}
    >
      {slide.eyebrow && (
        <p className="text-sm font-semibold tracking-widest uppercase opacity-80">
          {slide.eyebrow}
        </p>
      )}

      {slide.stat && (
        <p className="text-7xl font-extrabold tabular-nums drop-shadow-sm">
          {slide.stat}
        </p>
      )}

      <h2 className="text-3xl font-bold text-balance">{slide.title}</h2>

      {slide.subtitle && (
        <p className="max-w-[28ch] text-base text-pretty opacity-90">
          {slide.subtitle}
        </p>
      )}
    </div>
  );
}
