"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface PulseLabelProps {
  readonly children: ReactNode;
}

/**
 * Attention-drawing nav label, used while exec applications are open.
 *
 * Animates the glow and nothing else — no colour, weight, size or opacity of
 * its own — so the text renders identically to every other nav link and keeps
 * inheriting their `hover:text-nav-hover-blue`. The app is `forcedTheme="dark"`
 * (see AppProviders), so a white halo always sits on a dark ground.
 */
export function PulseLabel({ children }: PulseLabelProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <span
        style={{
          textShadow: "0 0 10px rgba(255, 255, 255, 0.7), 0 0 24px rgba(255, 255, 255, 0.4)"
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      animate={{
        // Layered like the repo's existing .animate-glow-pulse — the wide third
        // layer is what reads as a halo rather than a crisp outline.
        textShadow: [
          "0 0 6px rgba(255, 255, 255, 0.2), 0 0 14px rgba(255, 255, 255, 0.12), 0 0 26px rgba(255, 255, 255, 0.06)",
          "0 0 14px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.85), 0 0 52px rgba(255, 255, 255, 0.55)",
          "0 0 6px rgba(255, 255, 255, 0.2), 0 0 14px rgba(255, 255, 255, 0.12), 0 0 26px rgba(255, 255, 255, 0.06)"
        ]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}
