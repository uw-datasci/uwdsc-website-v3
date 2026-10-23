import { z } from "zod";
import { QUESTION_TYPES } from "@uwdsc/common/constants";
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

/** Question editor form. Numbers stay strings until submit (empty = no limit). */
export const questionFormSchema = z.object({
  questionText: z
    .string()
    .trim()
    .min(1, "Write the question")
    .max(500, "Keep it under 500 characters"),
  type: z.enum(QUESTION_TYPES),
  maxLength: z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 5000), {
      message: "Use a number from 1 to 5000, or leave it blank",
    }),
  placeholder: z.string().trim().max(200),
  helpText: z.string().trim().max(500),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;
