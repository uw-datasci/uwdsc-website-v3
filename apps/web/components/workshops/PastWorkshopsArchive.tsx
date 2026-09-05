"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Code, ExternalLink, FileText, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Input, SectionTitle } from "@uwdsc/ui";
import type { Event, EventResource } from "@uwdsc/common/types";
import { formatEventDescription } from "@uwdsc/common/utils";
import { formatDateTime, getTermLabel } from "@/lib/utils/events";

interface PastWorkshopsArchiveProps {
  readonly events: Event[];
}

interface ResourceKind {
  Icon: LucideIcon;
  host: string;
  href: string | null;
}

function isHost(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

function getResourceKind(url: string): ResourceKind {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { Icon: ExternalLink, host: "", href: null };
    }

    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const link = { host, href: parsed.href };

    if (
      isHost(host, "notion.site") ||
      isHost(host, "notion.so") ||
      parsed.pathname.toLowerCase().endsWith(".pdf") ||
      isHost(host, "docs.google.com") ||
      isHost(host, "drive.google.com")
    ) {
      return { Icon: FileText, ...link };
    }
    if (isHost(host, "colab.research.google.com") || isHost(host, "github.com")) {
      return { Icon: Code, ...link };
    }
    return { Icon: ExternalLink, ...link };
  } catch {
    return { Icon: ExternalLink, host: "", href: null };
  }
}

/** Groups events by Waterloo term, preserving the incoming (most-recent-first) order. */
function groupByTerm(events: Event[]): { term: string; events: Event[] }[] {
  const groups = new Map<string, Event[]>();
  for (const event of events) {
    const term = getTermLabel(event.start_time);
    const bucket = groups.get(term);
    if (bucket) bucket.push(event);
    else groups.set(term, [event]);
  }
  return [...groups.entries()].map(([term, groupEvents]) => ({ term, events: groupEvents }));
}

export function PastWorkshopsArchive({ events }: PastWorkshopsArchiveProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return events;
    return events.filter((event) => event.name.toLowerCase().includes(trimmed));
  }, [events, query]);

  const groups = useMemo(() => groupByTerm(filtered), [filtered]);
  const showTermHeaders = groups.length > 1;
  const showSearch = events.length >= 6;

  return (
    <div>
      <div className="relative mb-8 flex flex-col items-center gap-4 lg:mb-12">
        <SectionTitle mb="mb-0" className="text-xl md:text-2xl!">
          Workshop Archive
        </SectionTitle>
        {showSearch && (
          <div className="relative w-full max-w-64 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workshops…"
              className="rounded-full pl-9"
            />
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-center leading-loose text-grey2">
          No past workshops yet — check the{" "}
          <Link href="/calendar" className="text-white underline underline-offset-4">
            calendar
          </Link>{" "}
          for what&apos;s coming up.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center leading-loose text-grey2">
          No workshops match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <div key={group.term} className="flex flex-col gap-3">
              {showTermHeaders && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-grey2">
                    {group.term}
                  </span>
                  <span className="h-px flex-1 bg-grey3" />
                  <span className="text-xs text-grey2">
                    {group.events.length} {group.events.length === 1 ? "workshop" : "workshops"}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {group.events.map((event, index) => (
                  <ArchiveRow
                    key={event.id}
                    index={index + 1}
                    event={event}
                    isExpanded={expandedId === event.id}
                    onToggle={() =>
                      setExpandedId((current) => (current === event.id ? null : event.id))
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveRow({
  event,
  index,
  isExpanded,
  onToggle,
}: Readonly<{
  event: Event;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}>) {
  const reduceMotion = useReducedMotion();
  const contentId = `workshop-resources-${event.id}`;

  return (
    <motion.div
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-grey3"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="flex w-full items-center gap-4 px-5 py-4 text-left duration-300 ease-in-out hover:bg-grey3/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <span className="hidden shrink-0 font-mono text-xs text-grey3 sm:block">
          {String(index).padStart(2, "0")}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate font-medium text-white">{event.name}</span>
          <span className="text-sm text-grey2">{formatDateTime(event.start_time)}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm text-grey2">
          <span className="hidden rounded-full bg-grey3/30 px-3 py-1 text-xs sm:inline">
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
                    <ResourceLink key={resource.id} resource={resource} delay={i * 0.05} />
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

function ResourceLink({
  resource,
  delay,
}: Readonly<{ resource: EventResource; delay: number }>) {
  const reduceMotion = useReducedMotion();
  const { Icon, host, href } = getResourceKind(resource.url);

  const row = "flex items-center gap-2 rounded-lg bg-grey3/20 px-4 py-3 text-white";
  const body = (
    <>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate">{resource.source}</span>
      {host && <span className="shrink-0 text-xs text-grey2">{host}</span>}
    </>
  );

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: reduceMotion ? 0 : delay }}
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${row} transition-colors duration-200 hover:bg-grey3/30 hover:text-nav-hover-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        >
          {body}
        </a>
      ) : (
        <div className={`${row} opacity-60`} title="This link is unavailable">
          {body}
        </div>
      )}
    </motion.li>
  );
}
