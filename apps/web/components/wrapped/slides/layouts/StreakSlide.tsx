import { cn } from "@uwdsc/ui/lib/utils";
import { tiltWarp, atkinsonHyperlegibleMono, displayFontClass as display, monoFontClass as mono } from "../../fonts";
import type { StreakSlideData } from "../../types";

interface StreakSlideProps {
  readonly slide: StreakSlideData;
}

/**
 * "Your longest streak" slide.
 *
 * Data injection points (see {@link StreakSlideData}):
 * - `slide.subheading` / `slide.captionLines`
 */
export function StreakSlide({ slide }: StreakSlideProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-[#9cd8ea] px-4 py-5 text-black sm:px-8 sm:py-6",
        tiltWarp.variable,
        atkinsonHyperlegibleMono.variable,
      )}
    >
      <div className="relative z-10 flex h-full min-h-0 w-full max-w-104 flex-col items-center justify-center gap-4 pt-6 pb-2 sm:max-w-96 sm:gap-6 sm:pt-10 sm:pb-2">
        <div className="text-center">
          <h2 className={cn(display, "text-[2.2rem] leading-none tracking-tight text-black sm:text-[1.95rem]")}>
            {slide.heading}
          </h2>
          <p className={cn(display, "mt-1 text-[1.75rem] leading-none tracking-tight text-white sm:mt-1 sm:text-[1.5rem]")}>
            {slide.subheading}
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="size-60 rounded-[1.4rem] bg-[#ffd7df] sm:size-48 sm:rounded-[1.6rem]" />
        </div>

        <div className={cn(mono, "flex flex-col items-center gap-0.5 text-center text-[1.05rem] leading-snug text-black sm:text-[1rem]")}>
          {slide.captionLines.map((line) => (
            <p key={line} className="whitespace-nowrap">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
