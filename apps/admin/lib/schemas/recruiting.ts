import { z } from "zod";

/** Start the hiring cycle for the active term, hiring for the chosen target term. */
export const startCycleSchema = z.object({
  targetTermId: z.uuid("Pick the term you're hiring for"),
});

export type StartCycleFormValues = z.infer<typeof startCycleSchema>;
