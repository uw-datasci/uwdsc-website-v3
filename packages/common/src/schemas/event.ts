import { z } from "zod";

/**
 * Event schemas, shared by the admin event form/routes and the Discord event bot
 * (`@uwdsc/admin` discord-bot module) so both validate events with exactly the same rules.
 */

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

/**
 * A single "source + link" resource attached to a workshop (slides, a notebook, a recap page).
 * `id` is client-generated (crypto.randomUUID()) so useFieldArray rows have a stable identity
 * across edits/reorders instead of keying on array index.
 */
export const eventResourceSchema = z.object({
  id: z.uuid(),
  source: z.string().trim().min(1, "Source name is required").max(120),
  url: z
    .url({ error: "Enter a valid URL" })
    .refine((u) => u.startsWith("https://"), "Link must start with https://"),
});

const eventFields = {
  name: z.string().trim().min(1, "Event name is required"),
  description: z.string().trim().min(1, "Description is required"),
  location: z.string().trim().min(1, "Location is required"),
  image_url: z.string().trim().optional().nullable(),
  start_time: z.iso.datetime({ error: "Invalid start time" }),
  end_time: z.iso.datetime({ error: "Invalid end time" }),
  category: z.enum(["workshop", "social", "academic"], { error: "Event type is required" }),
  resources: z.array(eventResourceSchema).max(12, "At most 12 resources"),
  // Omitted by the admin form (the column defaults to true); false for Discord bot drafts.
  is_published: z.boolean().optional(),
};

const resourcesOnlyForWorkshops = (v: { category?: string; resources?: unknown[] }) =>
  v.category === "workshop" || !v.resources?.length;
const resourcesOnlyForWorkshopsError: { message: string; path: PropertyKey[] } = {
  message: "Only workshops can have resources",
  path: ["resources"],
};

/**
 * Schema for creating a new event.
 * Enforces that end_time must not be before start_time, and that resource links are only
 * attached to workshops.
 */
export const createEventSchema = z
  .object(eventFields)
  .refine(isEndAfterStart, endAfterStartError)
  .refine(resourcesOnlyForWorkshops, resourcesOnlyForWorkshopsError);

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

/**
 * Schema for updating an event (all fields optional - PATCH semantics).
 * Only validates the time ordering when both times are provided.
 */
export const updateEventSchema = z
  .object(eventFields)
  .partial()
  .refine(isEndAfterStart, endAfterStartError)
  .refine(resourcesOnlyForWorkshops, resourcesOnlyForWorkshopsError);

export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;
