"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, type CSSProperties, type ReactNode } from "react";

/**
 * Shared animation primitives for the reusable Wrapped slides.
 *
 * These are deliberately layout-agnostic: they attach motion to a slide's
 * *existing* elements (via `motion.*` + these variants) rather than introducing
 * new wrapper structure, so slide layouts stay untouched. Each Wrapped slide
 * remounts as it becomes active (see `AnimatePresence mode="wait"` in
 * `WrappedStory`), so "animate on mount" reads as "animate when the slide first
 * appears" — no scroll/intersection wiring needed.
 *
 * New slides opt in the same way the existing ones do:
 *   1. make the slide root a `motion.div` (from `framer-motion`) with
 *      `variants={slideStagger}`, `initial="hidden"` and `animate="show"`;
 *   2. mark each element that should fade in sequentially with
 *      `variants={slideItem}` (order follows DOM order);
 *   3. use `<CountUp>` for numeric stats and `<Floating>` for decorative SVGs.
 *
 * Reduced-motion is honoured globally by the `<MotionConfig reducedMotion="user">`
 * wrapper in `WrappedStory` (transforms are dropped, opacity kept); `CountUp`
 * additionally short-circuits to its final value since it isn't a transform.
 */

/** Gentle ease-out used across the slide animations. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Orchestrator for the staggered fade-in. Put this on the slide root; it holds
 * no visible styles of its own and only sequences children marked with
 * {@link slideItem}. Variant labels flow down through plain DOM wrappers, so the
 * items don't need to be direct children.
 */
export const slideStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

/** A single element in the staggered sequence: a subtle fade + rise. */
export const slideItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

interface CountUpProps {
  /** Final numeric value to animate to. */
  readonly value: number;
  /** Animation length in seconds. */
  readonly duration?: number;
  /** Delay before counting starts, in seconds. */
  readonly delay?: number;
  /**
   * Formats the in-flight number for display. Defaults to a locale-grouped
   * integer (e.g. `1,234`). Override to add units, decimals, etc.
   */
  readonly format?: (value: number) => string;
  readonly className?: string;
}

/**
 * Animates a number from 0 to `value` when it mounts (i.e. when the slide first
 * appears). Reusable for any numeric statistic — events attended, streak days,
 * membership terms, minutes on site, … — including future DB-driven values.
 */
export function CountUp({
  value,
  duration = 1.2,
  delay = 0.2,
  format,
  className,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) =>
    format ? format(latest) : Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    if (reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, delay, ease: "easeOut" });
    return () => controls.stop();
  }, [value, duration, delay, reduce, count]);

  return <motion.span className={className}>{display}</motion.span>;
}

interface CountUpTextProps extends Omit<CountUpProps, "value"> {
  /** Raw stat string, e.g. `"5"` or `"1,234"`. */
  readonly children: string;
}

/**
 * Convenience wrapper around {@link CountUp} for stat values that arrive as
 * strings (as today's placeholder data does). Counts up when the string is a
 * plain number; otherwise renders it verbatim so non-numeric stats stay safe.
 */
export function CountUpText({ children, className, ...rest }: CountUpTextProps) {
  const parsed = Number(children.replaceAll(",", ""));
  if (!Number.isFinite(parsed) || children.trim() === "") {
    return <span className={className}>{children}</span>;
  }
  return <CountUp value={parsed} className={className} {...rest} />;
}

interface FloatingProps {
  readonly children: ReactNode;
  /** Vertical travel in pixels (peak offset). Keep small for subtlety. */
  readonly amplitude?: number;
  /** Duration of one up-and-back cycle, in seconds. */
  readonly duration?: number;
  /** Phase offset so neighbouring elements don't bob in lockstep. */
  readonly delay?: number;
  /** Static rotation (deg). Passed as a motion transform so it composes with
   *  the animated `y` instead of being overwritten. */
  readonly rotate?: number;
  readonly className?: string;
  readonly style?: CSSProperties;
}

/**
 * Wraps a decorative element in a slow, looping up/down float. Motion is
 * transform-only, so `<MotionConfig reducedMotion="user">` disables it for users
 * who prefer reduced motion. Pass any static `rotate` here (not via CSS
 * `transform`) so it composes with the float.
 */
export function Floating({
  children,
  amplitude = 6,
  duration = 4,
  delay = 0,
  rotate = 0,
  className,
  style,
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      style={{ ...style, rotate }}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
