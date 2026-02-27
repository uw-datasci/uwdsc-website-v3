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

export type EventsRange = "active" | "next";

export async function getEventsByRange(range: "active"): Promise<Event[]>;
export async function getEventsByRange(range: "next"): Promise<Event | null>;
export async function getEventsByRange(
  range: EventsRange,
): Promise<Event[] | Event | null> {
  const response = await fetch(`/api/events?range=${range}`);
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function getCheckInStatus(
  eventId: string,
): Promise<{ checkedIn: boolean }> {
  const response = await fetch(`/api/events/${eventId}/checkin`);
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}

export async function checkInToEvent(
  eventId: string,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`/api/events/${eventId}/checkin`, {
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
