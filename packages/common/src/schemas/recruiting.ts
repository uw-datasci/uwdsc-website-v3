import { z } from "zod";
import {
  MAX_OFFER_RESPONSE_HOURS,
  MAX_POSITION_OPENINGS,
  QUESTION_TYPES,
  SLOT_DECISIONS,
  SLOT_KINDS,
} from "../constants/recruiting";
import { SELECTION_STATUSES } from "../recruiting/status";

/**
 * Recruiting schemas, shared by the admin routes/forms and the `@uwdsc/admin` services
 * (which also parse the stored leadership draft with them).
 */

// ==========================================
//  Leadership
// ==========================================

export const leadershipSlotSchema = z.object({
  id: z.string().min(1).max(64),
  kind: z.enum(SLOT_KINDS),
  positionId: z.number().int().positive(),
  outgoingProfileId: z.uuid().nullable(),
  decision: z.enum(SLOT_DECISIONS),
  successorProfileId: z.uuid().nullable(),
});
export type LeadershipSlot = z.infer<typeof leadershipSlotSchema>;

export const leadershipDraftSchema = z.object({
  slots: z.array(leadershipSlotSchema).max(200),
});
export type LeadershipDraft = z.infer<typeof leadershipDraftSchema>;

/** A non-VP position picked for hiring, with how many people it needs. */
export const hiringPickSchema = z.object({
  positionId: z.number().int().positive(),
  openings: z.number().int().min(1).max(MAX_POSITION_OPENINGS),
});
export type HiringPick = z.infer<typeof hiringPickSchema>;

// ==========================================
//  Setup
// ==========================================

export const scheduleSchema = z
  .object({
    releaseDate: z.iso.datetime({ offset: true, message: "Pick a release date" }),
    softDeadline: z.iso.datetime({ offset: true, message: "Pick a deadline" }),
    hardDeadline: z.iso.datetime({ offset: true, message: "Pick a final cutoff" }),
    targetTermId: z.uuid("Pick the term you're hiring for"),
    offerResponseHours: z
      .number()
      .int("Use whole hours")
      .min(1, "At least 1 hour")
      .max(MAX_OFFER_RESPONSE_HOURS, "At most 2 weeks"),
  })
  .refine((v) => new Date(v.releaseDate) < new Date(v.softDeadline), {
    message: "The deadline must be after the release date",
    path: ["softDeadline"],
  })
  .refine((v) => new Date(v.softDeadline) <= new Date(v.hardDeadline), {
    message: "The final cutoff can't be before the deadline",
    path: ["hardDeadline"],
  });
export type ScheduleInput = z.infer<typeof scheduleSchema>;

export const addPositionSchema = z.object({
  positionId: z.number().int().positive(),
});

export const updatePositionSchema = z
  .object({
    isOpen: z.boolean().optional(),
    openings: z.number().int().min(1).max(MAX_POSITION_OPENINGS).optional(),
  })
  .refine((v) => v.isOpen !== undefined || v.openings !== undefined, "Nothing to update");
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;

export const questionFieldsSchema = z.object({
  questionText: z
    .string()
    .trim()
    .min(1, "Write the question")
    .max(500, "Keep it under 500 characters"),
  type: z.enum(QUESTION_TYPES),
  maxLength: z.number().int().min(1).max(5000).nullable(),
  placeholder: z.string().trim().max(200).nullable(),
  helpText: z.string().trim().max(500).nullable(),
});
export type QuestionFields = z.infer<typeof questionFieldsSchema>;

/** positionId null = a General question. */
export const createQuestionSchema = questionFieldsSchema.extend({
  positionId: z.number().int().positive().nullable(),
});
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = z.union([
  questionFieldsSchema,
  z.object({ archived: z.boolean() }),
]);
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export const reorderQuestionsSchema = z.object({
  positionId: z.number().int().positive().nullable(),
  questionIds: z.array(z.number().int().positive()).min(1).max(200),
});
export type ReorderQuestionsInput = z.infer<typeof reorderQuestionsSchema>;

// ==========================================
//  Board
// ==========================================

/** Move a card. `from` is the status the client saw, so stale moves are rejected. */
export const moveCardSchema = z.object({
  from: z.enum(SELECTION_STATUSES),
  to: z.enum(SELECTION_STATUSES),
  undo: z.boolean().optional(),
});
export type MoveCardInput = z.infer<typeof moveCardSchema>;
