"use client";

import { useReducedMotion } from "framer-motion";
import { Clock, LogIn, MapPin } from "lucide-react";
import Link from "next/link";
import { SectionTitle } from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import { formatEventDescription } from "@uwdsc/common/utils";
import { formatDateTime } from "@/lib/utils/events";
import { PillarMotif } from "./PillarMotif";

interface CurrentWorkshopProps {
  readonly event: Event;
}

/**
 * The "happening now" state of the next-workshop panel -- an in-progress workshop (start_time
 * passed, end_time still ahead). Trades the countdown for a check-in CTA: event detail fills the
 * left 2/3 of the card, and the check-in link occupies the right 1/3, stretched by the grid to
 * match the detail column's height rather than sized to its own content.
 */
export function CurrentWorkshop({ event }: CurrentWorkshopProps) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <SectionTitle mb="mb-8 lg:mb-12" className="text-xl md:text-2xl!">
        Workshop Happening Now
      </SectionTitle>

      <div className="relative overflow-hidden rounded-3xl border border-grey2 p-8 sm:p-10">
        <div className="bg-gradient-purple absolute inset-0 opacity-10" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 text-white opacity-[0.06]">
          <PillarMotif pillar="ml-foundations" />
        </div>

        <div className="relative z-10 grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-col justify-center gap-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                {!reduceMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
                Happening now
              </p>
            </div>

            <h3 className="text-2xl font-bold text-white sm:text-3xl">{event.name}</h3>

            <p className="leading-loose text-grey1">
              {formatEventDescription(event.description)}
            </p>

            <div className="flex flex-col gap-2 text-sm text-grey2 sm:flex-row sm:gap-6">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 shrink-0 text-sky-400" aria-hidden="true" />
                {formatDateTime(event.start_time)}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  {event.location}
                </span>
              )}
            </div>
          </div>

          <Link
            href="/events"
            className="bg-gradient-purple group flex flex-col items-center justify-center gap-2 rounded-2xl px-6 py-8 text-center transition-transform duration-300 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:col-span-1"
          >
            <LogIn className="size-8 text-white" aria-hidden="true" />
            <span className="text-lg font-bold text-white">Check In</span>
            <span className="text-xs text-white/70">Tap to check in →</span>
          </Link>
        </div>
      </div>
    </>
  );
}
