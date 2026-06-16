import type { Event, EventWithAttendanceCount, Term } from "@uwdsc/common/types";
import { formatEventDescription, formatTermCode } from "@uwdsc/common/utils";

/** IANA time zone used for all event times in the admin app. */
export const EVENT_TIMEZONE = "America/Toronto";

/** Human-readable label for event times shown in the admin UI. */
export const EVENT_TIMEZONE_LABEL = "Eastern Time (EST/EDT)";

interface ZonedDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function getZonedDateParts(date: Date, timeZone: string): ZonedDateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") % 24,
    minute: get("minute"),
    second: get("second"),
  };
}

function wallClockInZoneToUtcIso(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
  seconds: number,
  timeZone: string,
): string {
  const utcGuess = Date.UTC(year, month, day, hours, minutes, seconds);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const getOffset = (utcMs: number): number => {
    const zonedParts = formatter.formatToParts(new Date(utcMs));
    const values = Object.fromEntries(
      zonedParts
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    ) as Record<Intl.DateTimeFormatPartTypes, number>;

    const asUtc = Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour % 24,
      values.minute,
      values.second,
    );
    return asUtc - utcMs;
  };

  let utcMs = utcGuess;
  for (let i = 0; i < 3; i++) {
    const offset = getOffset(utcMs);
    const next = utcGuess - offset;
    if (next === utcMs) break;
    utcMs = next;
  }

  return new Date(utcMs).toISOString();
}

/**
 * Convert a stored UTC ISO string into a picker value that always displays
 * Eastern wall-clock time regardless of the browser's local time zone.
 */
export function utcIsoToPickerValue(iso: string): string {
  const parts = getZonedDateParts(new Date(iso), EVENT_TIMEZONE);
  return new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  ).toISOString();
}

/**
 * Interpret a DateTimePicker ISO value as Eastern wall-clock time and return UTC ISO.
 */
export function pickerValueToUtcIso(pickerIso: string): string {
  const pickerDate = new Date(pickerIso);
  return wallClockInZoneToUtcIso(
    pickerDate.getFullYear(),
    pickerDate.getMonth(),
    pickerDate.getDate(),
    pickerDate.getHours(),
    pickerDate.getMinutes(),
    pickerDate.getSeconds(),
    EVENT_TIMEZONE,
  );
}

/**
 * Format an ISO date string for display in Eastern Time (e.g. "MMM d, yyyy h:mm a ET").
 */
export function formatDateTime(iso: string): string {
  try {
    const formatted = new Intl.DateTimeFormat("en-US", {
      timeZone: EVENT_TIMEZONE,
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
    return `${formatted} ET`;
  } catch {
    return iso;
  }
}

/**
 * Convert an ISO date string to ICS format (YYYYMMDDTHHMMSSZ).
 */
export function toICSDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(/\.\d{3}/, "");
}

/**
 * Escape text for use in ICS fields (SUMMARY, DESCRIPTION, LOCATION).
 */
export function escapeICSText(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll(";", String.raw`\;`)
    .replaceAll(",", String.raw`\,`)
    .replaceAll("\n", String.raw`\n`);
}

/**
 * Build a full ICS calendar string from a list of events.
 */
export function buildICS(events: Event[]): string {
  const vevents = events.map((event) => {
    const start = toICSDate(event.start_time);
    const end = toICSDate(event.end_time);
    return [
      "BEGIN:VEVENT",
      `UID:${event.id}@uwdsc`,
      `DTSTAMP:${start}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escapeICSText(event.name)}`,
      `DESCRIPTION:${escapeICSText(formatEventDescription(event.description || ""))}`,
      `LOCATION:${escapeICSText(event.location || "")}`,
      "END:VEVENT",
    ].join("\r\n");
  });
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UWDSC//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...vevents,
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Build a Google Calendar "Add event" URL for a single event.
 */
export function getGoogleCalendarUrl(event: Event): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: `${toICSDate(event.start_time)}/${toICSDate(event.end_time)}`,
    details: formatEventDescription(event.description || ""),
    location: event.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Trigger a client-side download of a single event as an .ics file.
 */
export function downloadICS(event: Event): void {
  const start = toICSDate(event.start_time);
  const end = toICSDate(event.end_time);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//UWDSC//Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@uwdsc`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICSText(event.name)}`,
    `DESCRIPTION:${escapeICSText(formatEventDescription(event.description || ""))}`,
    `LOCATION:${escapeICSText(event.location || "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.name.replaceAll(/[^a-z0-9]/gi, "_")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

interface EndAfterStartError {
  start_time?: string;
  end_time?: string;
}

/** Returns true when end_time is not before start_time. */
export function isEndAfterStart({ start_time, end_time }: EndAfterStartError) {
  if (!start_time || !end_time) return true;
  return new Date(end_time) >= new Date(start_time);
}

export const endAfterStartError: { message: string; path: PropertyKey[] } = {
  message: "End date & time must be after start date & time",
  path: ["end_time"],
};

// ─── Term helpers ────────────────────────────────────────────────────────────

function toMs(iso: string | null | undefined): number | null {
  if (iso == null || iso === "") return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

/**
 * Find the term whose [start_date, end_date] window contains the event's start_time.
 * Returns null when no retained term covers the event.
 */
export function getEventTerm(event: Event, terms: Term[]): Term | null {
  const eventMs = toMs(event.start_time);
  if (eventMs === null) return null;

  return (
    terms.find((term) => {
      const start = toMs(term.start_date);
      const end = toMs(term.end_date);
      if (start === null || end === null) return false;
      return eventMs >= start && eventMs <= end;
    }) ?? null
  );
}

// ─── CSV export helpers ───────────────────────────────────────────────────────

export const EVENT_CSV_HEADERS = [
  "name",
  "start_time",
  "end_time",
  "location",
  "attendance",
  "term",
] as const;

export type EventCsvHeader = (typeof EVENT_CSV_HEADERS)[number];

/**
 * Get the CSV value for an event row given a column key.
 * Attendance is only shown for events that have already ended.
 */
export function getEventCsvValue(
  row: EventWithAttendanceCount,
  key: string,
  terms: Term[],
): unknown {
  switch (key as EventCsvHeader) {
    case "name":
      return row.name;
    case "start_time":
      return formatDateTime(row.start_time);
    case "end_time":
      return formatDateTime(row.end_time);
    case "location":
      return row.location;
    case "attendance": {
      if (new Date(row.end_time) >= new Date()) return "";
      if (row.attendance_count === 0 && getEventTerm(row, terms) === null)
        return "N/A";
      return row.attendance_count;
    }
    case "term": {
      const term = getEventTerm(row, terms);
      return term ? formatTermCode(term.code) : "Other";
    }
    default:
      return "";
  }
}
