import { z } from "zod";
import { isEndAfterStart, endAfterStartError } from "@/lib/utils/events";

const eventFields = {
  name: z.string().trim().min(1, "Event name is required"),
  description: z.string().trim().min(1, "Description is required"),
  location: z.string().trim().min(1, "Location is required"),
  image_url: z.string().trim().optional().nullable(),
  start_time: z.iso.datetime({ error: "Invalid start time" }),
  end_time: z.iso.datetime({ error: "Invalid end time" }),
};

/**
 * Schema for creating a new event.
 * Enforces that end_time must not be before start_time.
 */
export const createEventSchema = z
  .object(eventFields)
  .refine(isEndAfterStart, endAfterStartError);

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

/**
 * Schema for updating an event (all fields optional — PATCH semantics).
 * Only validates the time ordering when both times are provided.
 */
export const updateEventSchema = z
  .object(eventFields)
  .partial()
  .refine(isEndAfterStart, endAfterStartError);

export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;
