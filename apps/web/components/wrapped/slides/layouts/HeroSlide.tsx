import { motion } from "framer-motion";
import { cn } from "@uwdsc/ui/lib/utils";
import type { HeroSlideData } from "../../types";
import { CountUpText, slideItem, slideStagger } from "../motion";

interface HeroSlideProps {
  readonly slide: HeroSlideData;
}

/**
 * Generic full-bleed headline/stat slide. Used for the intro, outro, and
 * "top event" slides, each with its own background gradient.
 *
 * Data injection points (see {@link HeroSlideData}):
 * - `slide.eyebrow`: optional small label above the title.
 * - `slide.title`: the main headline.
 * - `slide.stat`: optional large hero number, rendered above the title.
 * - `slide.subtitle`: optional supporting copy below the title.
 * - `slide.background`: Tailwind classes for the slide background. This is
 *   the color customization point, there's nothing hardcoded to edit here.
 * - `slide.foreground`: Tailwind text-color class for the content, defaults
 *   to `text-white`.
 */
export function HeroSlide({ slide }: HeroSlideProps) {
  return (
    <motion.div
      variants={slideStagger}
      initial="hidden"
      animate="show"
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center",
        slide.background,
        slide.foreground ?? "text-white",
      )}
    >
      {slide.eyebrow && (
        <motion.p
          variants={slideItem}
          className="text-sm font-semibold tracking-widest uppercase opacity-80"
        >
          {slide.eyebrow}
        </motion.p>
      )}

      {slide.stat && (
        <motion.p
          variants={slideItem}
          className="text-7xl font-extrabold tabular-nums drop-shadow-sm"
        >
          <CountUpText>{slide.stat}</CountUpText>
        </motion.p>
      )}

      <motion.h2 variants={slideItem} className="text-3xl font-bold text-balance">
        {slide.title}
      </motion.h2>

      {slide.subtitle && (
        <motion.p
          variants={slideItem}
          className="max-w-[28ch] text-base text-pretty opacity-90"
        >
          {slide.subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
