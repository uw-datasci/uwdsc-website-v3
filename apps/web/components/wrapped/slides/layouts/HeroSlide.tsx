import { motion } from "framer-motion";
import { cn } from "@uwdsc/ui/lib/utils";
import type { HeroSlideData } from "../../types";
import { CountUpText, slideItem, slideStagger } from "../motion";

interface HeroSlideProps {
  readonly slide: HeroSlideData;
}

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
