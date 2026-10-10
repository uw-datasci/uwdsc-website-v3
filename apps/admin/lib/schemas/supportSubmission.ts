import { z } from "zod";

/** Resolve or reopen a support submission. */
export const resolveSubmissionSchema = z.object({
  resolved: z.boolean(),
});

export type ResolveSubmissionFormValues = z.infer<typeof resolveSubmissionSchema>;
