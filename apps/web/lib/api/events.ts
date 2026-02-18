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
