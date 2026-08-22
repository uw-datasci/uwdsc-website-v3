"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Button, SectionTitle } from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import { formatEventDescription } from "@uwdsc/common/utils";
import { formatDateTime, getGoogleCalendarUrl } from "@/lib/utils/events";
import { useCountdown } from "@/hooks/useCountdown";
import { PillarMotif } from "./PillarMotif";
import { CurrentWorkshop } from "./CurrentWorkshop";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * A single countdown value, rolling vertically like an odometer when it changes: the outgoing
 * value slides down and out of frame while the incoming value slides down into place from above.
 */
function RollingDigit({
  value,
  reduceMotion,
}: {
  value: string;
  reduceMotion: boolean | null;
}) {
  return (
    <span className="relative flex h-[1em] items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduceMotion ? false : { y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduceMotion ? undefined : { y: "100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface UpcomingWorkshopProps {
  /** Upcoming workshops (end_time in the future), soonest first. Never empty -- the page only
   *  mounts this section when there's at least one. */
  readonly events: Event[];
}

/**
 * Advertises the next workshop(s) -- the loudest section on the page. Deliberately carries no
 * resource links -- those only exist for the past-workshop archive; an event here hasn't happened
 * yet. Once the featured event's start_time passes (it's still here because end_time hasn't),
 * this hands off to `CurrentWorkshop` for the in-progress, check-in-oriented layout.
 */
export function UpcomingWorkshop({ events }: UpcomingWorkshopProps) {
  const [featured, ...rest] = events;
  const countdown = useCountdown(featured?.start_time ?? null);
  const reduceMotion = useReducedMotion();

  // useCountdown returns null both before mount (no stable server "now") and once the target has
  // elapsed -- track mount separately so an in-progress workshop (start_time already passed, but
  // end_time still ahead -- it's in `events` because the page splits on end_time) renders as
  // CurrentWorkshop rather than a dead --:--:--:-- skeleton.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // `events` is documented (and only ever called) non-empty, but narrow explicitly for TS.
  if (!featured) return null;

  const happeningNow = mounted && !countdown;

  const tiles = [
    { label: "Days", value: countdown ? pad(countdown.days) : "--" },
    { label: "Hrs", value: countdown ? pad(countdown.hours) : "--" },
    { label: "Min", value: countdown ? pad(countdown.minutes) : "--" },
    { label: "Sec", value: countdown ? pad(countdown.seconds) : "--" },
  ];

  return (
    <div id="next-workshop" className="scroll-mt-24">
      {happeningNow ? (
        <CurrentWorkshop event={featured} />
      ) : (
        <>
          <SectionTitle mb="mb-8 lg:mb-12" className="text-xl md:text-2xl!">
            Next Workshop
          </SectionTitle>

          <div className="relative overflow-hidden rounded-3xl border border-grey2 p-8 sm:p-10">
            <div className="bg-gradient-purple absolute inset-0 opacity-10" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 text-white opacity-[0.06]">
              <PillarMotif pillar="ml-foundations" />
            </div>

            <div className="relative z-10 flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:items-center lg:gap-8">
              <div className="flex flex-col items-center gap-6 lg:col-span-2 lg:items-stretch">
                <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-grey2">
                  Starts in
                </p>
                <div className="flex items-center justify-center gap-4 sm:gap-5">
                  {tiles.map((tile, i) => (
                    <div key={tile.label} className="flex items-center gap-4 sm:gap-5">
                      <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 sm:h-24 sm:w-24">
                        <div className="font-family-clash text-3xl tabular-nums text-white sm:text-5xl">
                          <RollingDigit value={tile.value} reduceMotion={reduceMotion} />
                        </div>
                        <div className="mt-1 whitespace-nowrap text-[9px] uppercase tracking-[0.15em] text-grey2 sm:text-[10px] sm:tracking-[0.2em]">
                          {tile.label}
                        </div>
                      </div>
                      {i < tiles.length - 1 && (
                        <span className="font-family-clash text-2xl text-grey3 sm:text-4xl">
                          :
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button
                    className="bg-gradient-purple rounded-full px-6 py-6 text-sm font-bold text-white transition-transform hover:scale-105"
                    onClick={() =>
                      window.open(
                        getGoogleCalendarUrl(featured),
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <CalendarPlus className="mr-1.5 size-4" aria-hidden="true" />
                    Add to Google Calendar
                  </Button>
                  <div className="rounded-full bg-linear-to-tr from-pink-500 to-indigo-700 p-px">
                    <Button
                      asChild
                      variant="ghost"
                      className="rounded-full bg-background px-6 py-6 text-sm"
                    >
                      <Link href="/calendar">See full calendar →</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:col-span-1 lg:border-l lg:border-grey3/60 lg:pl-8">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-grey2">
                    Next Workshop
                  </p>
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">{featured.name}</h3>
                </div>

                <p className="leading-loose text-grey1">
                  {formatEventDescription(featured.description)}
                </p>

                <div className="flex flex-col gap-2 text-sm text-grey2 sm:flex-row sm:gap-6 lg:flex-col lg:gap-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 shrink-0 text-sky-400" aria-hidden="true" />
                    {formatDateTime(featured.start_time)}
                  </span>
                  {featured.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      {featured.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {rest.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-grey2">
            Also coming up
          </p>
          {rest.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-1 rounded-2xl border border-grey3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium text-white">{event.name}</span>
              <span className="text-sm text-grey2">{formatDateTime(event.start_time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
