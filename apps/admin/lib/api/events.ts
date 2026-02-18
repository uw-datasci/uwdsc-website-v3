/**
 * Events API Functions
 *
 * This file contains all event-related API calls.
 * Components should use these functions instead of making direct fetch calls.
 */

import type {
  CreateEventFormValues,
  UpdateEventFormValues,
} from "@/lib/schemas/event";
import { createApiError } from "./error";
import { Event } from "@uwdsc/common/types";

/**
 * Get all events
 *
 * @returns Promise with array of all events
 * @throws Error if request fails or unauthorized
 */
export async function getAllEvents(): Promise<Event[]> {
  const response = await fetch("/api/events");

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

/**
 * Get a single event by ID
 *
 * @param eventId - The event UUID
 * @returns Promise with the event
 * @throws Error if request fails or unauthorized
 */
export async function getEventById(eventId: string): Promise<Event> {
  const response = await fetch(`/api/events/${eventId}`);

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data;
}

/**
 * Create a new event
 *
 * @param eventData - Event fields to create
 * @returns Promise with the created event
 * @throws Error if request fails or unauthorized
 */
export async function createEvent(
  eventData: CreateEventFormValues,
): Promise<Event> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);

  return data.event;
}

/**
 * Update an event
 *
 * @param eventId - The event UUID
 * @param eventData - Event fields to update (partial)
 * @returns Promise indicating success
 * @throws Error if request fails or unauthorized
 */
export async function updateEvent(
  eventId: string,
  eventData: UpdateEventFormValues,
): Promise<void> {
  const response = await fetch(`/api/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);
}

/**
 * Delete an event
 *
 * @param eventId - The event UUID
 * @returns Promise indicating success
 * @throws Error if request fails or unauthorized
 */
export async function deleteEvent(eventId: string): Promise<void> {
  const response = await fetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) throw createApiError(data, response.status);
}
