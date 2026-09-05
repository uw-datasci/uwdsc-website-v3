"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn, SectionTitle } from "@uwdsc/ui";
import { WORKSHOP_PILLARS, type PillarId } from "@/constants/workshops";
import { PillarMotif } from "./PillarMotif";

/**
 * What the club teaches, as a hover-expand accordion strip rather than a wrapping grid or
 * carousel: 6 equal-width segments in one fixed-height row. Hovering/focusing a segment grows it
 * (a framer `layout` animation on the flex-grow class) to reveal its blurb, while the rest
 * compress to just a title -- the row's height never changes, only how the width is split. Each
 * segment carries a visible background motif tinted in the pillar's accent color in place of a
 * dot indicator.
 */
export function WhatWeDo() {
  const [activeId, setActiveId] = useState<PillarId | null>(null);
  const reduceMotion = useReducedMotion();

  const clear = (id: PillarId) => setActiveId((current) => (current === id ? null : current));

  return (
    <div>
      <SectionTitle mb="mb-8 lg:mb-12" className="text-xl md:text-2xl!">
        What We Do
      </SectionTitle>
      <div className="flex h-36 gap-3">
        {WORKSHOP_PILLARS.map((pillar) => {
          const isActive = pillar.id === activeId;

          return (
            <motion.button
              key={pillar.id}
              type="button"
              layout
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              aria-expanded={isActive}
              onMouseEnter={() => setActiveId(pillar.id)}
              onMouseLeave={() => clear(pillar.id)}
              onFocus={() => setActiveId(pillar.id)}
              onBlur={() => clear(pillar.id)}
              onClick={() =>
                setActiveId((current) => (current === pillar.id ? null : pillar.id))
              }
              className={cn(
                "relative flex min-w-0 flex-col overflow-hidden rounded-2xl border p-4 text-left duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "flex-[3] justify-start gap-2 border-grey2 bg-grey4/40"
                  : "flex-1 justify-center gap-1.5 border-grey3 bg-grey4/20 hover:border-grey2"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute -right-4 -top-4 h-28 w-28 opacity-25 transition-opacity duration-300 ease-in-out",
                  pillar.motifClass,
                  isActive && "opacity-40"
                )}
              >
                <PillarMotif pillar={pillar.id} />
              </div>

              <div className="relative z-10 flex items-center gap-2">
                <h3
                  className={cn(
                    "font-bold text-white",
                    isActive ? "text-lg" : "truncate text-sm"
                  )}
                >
                  {pillar.title}
                </h3>
              </div>

              {isActive && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: reduceMotion ? 0 : 0.1 }}
                  className="relative z-10 flex min-w-0 flex-1 flex-col justify-between overflow-hidden"
                >
                  <p className="line-clamp-2 text-sm leading-relaxed text-grey1">
                    {pillar.blurb}
                  </p>
                  <p className="truncate text-xs text-grey2">{pillar.topics.join(" · ")}</p>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
