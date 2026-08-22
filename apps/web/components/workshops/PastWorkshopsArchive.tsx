"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { SectionTitle } from "@uwdsc/ui";
import type { Event } from "@uwdsc/common/types";
import { formatEventDescription } from "@uwdsc/common/utils";
import { formatDateTime } from "@/lib/utils/events";

interface PastWorkshopsArchiveProps {
  /** Past workshops (end_time already elapsed), most recent first. May be empty -- e.g. the
   *  club's first-ever workshop is still upcoming. */
  readonly events: Event[];
}

export function PastWorkshopsArchive({ events }: PastWorkshopsArchiveProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <SectionTitle mb="mb-8 lg:mb-12" className="text-xl md:text-2xl!">
        Past Workshops
      </SectionTitle>

      {events.length === 0 ? (
        <p className="text-center leading-loose text-grey2">
          No past workshops yet — check back after this term&apos;s sessions wrap up.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <ArchiveRow
              key={event.id}
              event={event}
              isExpanded={expandedId === event.id}
              onToggle={() =>
                setExpandedId((current) => (current === event.id ? null : event.id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveRow({
  event,
  isExpanded,
  onToggle,
}: Readonly<{
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
}>) {
  const reduceMotion = useReducedMotion();
  const contentId = `workshop-resources-${event.id}`;

  return (
    <motion.div layout className="overflow-hidden rounded-2xl border border-grey3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left duration-300 ease-in-out hover:bg-grey3/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-medium text-white">{event.name}</span>
          <span className="text-sm text-grey2">{formatDateTime(event.start_time)}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm text-grey2">
          <span>
            {event.resources.length} {event.resources.length === 1 ? "resource" : "resources"}
          </span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={contentId}
            key="content"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-4 border-t border-grey3 px-5 py-4">
              {event.description && (
                <p className="leading-loose text-grey2">
                  {formatEventDescription(event.description)}
                </p>
              )}
              {event.resources.length === 0 ? (
                <p className="text-sm text-grey2">Resources coming soon.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {event.resources.map((resource, i) => (
                    <motion.li
                      key={resource.id}
                      initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: reduceMotion ? 0 : i * 0.05 }}
                    >
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-grey3/20 px-4 py-3 text-white transition-colors duration-200 hover:bg-grey3/30 hover:text-nav-hover-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                        {resource.source}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
