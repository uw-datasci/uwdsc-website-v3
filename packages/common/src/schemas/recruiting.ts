import { z } from "zod";
import { MAX_POSITION_OPENINGS, SLOT_DECISIONS, SLOT_KINDS } from "../constants/recruiting";

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
