import { format, parseISO } from "date-fns";
import type { Event } from "@uwdsc/common/types";

/**
 * Format an ISO date string for display (e.g. "MMM d, yyyy h:mm a").
 */
export function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy h:mm a");
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
      `DESCRIPTION:${escapeICSText(event.description || "")}`,
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
    details: event.description || "",
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
    `DESCRIPTION:${escapeICSText(event.description || "")}`,
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
