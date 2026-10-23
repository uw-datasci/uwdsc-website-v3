import { z } from "zod";
import { hiringPickSchema, leadershipDraftSchema } from "@uwdsc/common/schemas";

/** Start the hiring cycle for the active term, hiring for the chosen target term. */
export const startCycleSchema = z.object({
  targetTermId: z.uuid("Pick the term you're hiring for"),
});

export type StartCycleFormValues = z.infer<typeof startCycleSchema>;

/** Save the leadership draft (before the lock) or lock it. */
export const saveLeadershipSchema = z.object({
  draft: leadershipDraftSchema,
  hiring: z.array(hiringPickSchema).max(200),
});

/** Apply leadership edits after the lock. */
export const updateLeadershipSchema = z.object({
  draft: leadershipDraftSchema,
});
