"use client";

import { CalendarPlus, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Button, SectionTitle } from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import { formatEventDescription } from "@uwdsc/common/utils";
import { formatDateTime, getGoogleCalendarUrl, downloadICS } from "@/lib/utils/events";
import { useCountdown } from "@/hooks/useCountdown";

const pad = (value: number) => String(value).padStart(2, "0");

interface UpcomingWorkshopProps {
  /** Upcoming workshops (end_time in the future), soonest first. Never empty -- the page only
   *  mounts this section when there's at least one. */
  readonly events: Event[];
}

/**
 * Advertises the next workshop(s). Deliberately carries no resource links -- those only exist
 * for the past-workshop archive; an event here hasn't happened yet.
 */
export function UpcomingWorkshop({ events }: UpcomingWorkshopProps) {
  const [featured, ...rest] = events;
  const countdown = useCountdown(featured?.start_time ?? null);

  // `events` is documented (and only ever called) non-empty, but narrow explicitly for TS.
  if (!featured) return null;

  return (
    <div>
      <SectionTitle mb="mb-8 lg:mb-12" className="text-xl md:text-2xl!">
        Upcoming Workshop
      </SectionTitle>

      <div className="relative overflow-hidden rounded-3xl border border-grey2 p-8 sm:p-10">
        <div className="bg-gradient-purple absolute inset-0 opacity-10" />

        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">{featured.name}</h3>
            {countdown && (
              <p className="mt-2 font-mono text-sm text-grey1">
                Starts in {pad(countdown.days)}d {pad(countdown.hours)}h{" "}
                {pad(countdown.minutes)}m {pad(countdown.seconds)}s
              </p>
            )}
          </div>

          <p className="leading-loose text-grey1">
            {formatEventDescription(featured.description)}
          </p>

          <div className="flex flex-col gap-2 text-sm text-grey2 sm:flex-row sm:gap-6">
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

          <div className="flex flex-wrap gap-4">
            <Button
              className="bg-gradient-purple rounded-full px-6 py-6 text-sm font-bold text-white transition-transform hover:scale-105"
              onClick={() =>
                window.open(getGoogleCalendarUrl(featured), "_blank", "noopener,noreferrer")
              }
            >
              <CalendarPlus className="mr-1.5 size-4" aria-hidden="true" />
              Add to Google Calendar
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 py-6 text-sm"
              onClick={() => downloadICS(featured)}
            >
              Download .ics
            </Button>
            <Button asChild variant="ghost" className="rounded-full px-6 py-6 text-sm">
              <Link href="/calendar">See full calendar →</Link>
            </Button>
          </div>
        </div>
      </div>

      {rest.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-grey2">
            Also coming up
          </p>
          {rest.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-1 rounded-xl border border-grey3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
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
