import { z } from "zod";

/**
 * Schema for creating a new event
 */
export const createEventSchema = z.object({
  name: z.string().trim().min(1, "Event name is required"),
  description: z.string().trim().min(1, "Description is required"),
  location: z.string().trim().min(1, "Location is required"),
  image_url: z.string().trim().optional().nullable(),
  start_time: z.string().datetime({ message: "Invalid start time" }),
  end_time: z.string().datetime({ message: "Invalid end time" }),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

/**
 * Schema for updating an event (all fields optional — PATCH semantics)
 */
export const updateEventSchema = createEventSchema.partial();

export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;
