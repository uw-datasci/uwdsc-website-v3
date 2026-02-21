/**
 * Events API (read-only for public calendar)
 */

import type { Event } from "@uwdsc/common/types";
import { createApiError } from "./errors";

export async function getEvents(): Promise<Event[]> {
  const response = await fetch("/api/events");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function getActiveEvents(): Promise<{
  activeEvents: Event[];
  nextEvent: Event | null;
}> {
  const response = await fetch("/api/events/active");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function getAttendanceStatus(
  eventId: string,
): Promise<{ checked_in: boolean }> {
  const response = await fetch(
    `/api/events/attendance?event_id=${encodeURIComponent(eventId)}`,
  );
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function getMembershipStatus(): Promise<{
  has_membership: boolean;
  membership_id: string | null;
}> {
  const response = await fetch("/api/membership");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
