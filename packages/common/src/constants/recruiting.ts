import type { ApplicationInputType } from "../types/shared/enums";

/**
 * Leadership roster: what happens to each seat next term. A seat ("slot") is a president
 * seat or one VP seat on an `is_vp` exec position; co-VPs are two slots on one position.
 */
export const SLOT_DECISIONS = [
  "continuing",
  "successor",
  "open",
  "leaving",
  "undecided",
] as const;
export type SlotDecision = (typeof SLOT_DECISIONS)[number];

export const SLOT_KINDS = ["pres", "vp"] as const;
export type SlotKind = (typeof SLOT_KINDS)[number];

export const SLOT_DECISION_LABELS: Record<SlotDecision, string> = {
  continuing: "Continuing",
  successor: "Successor chosen",
  open: "Open to public",
  leaving: "Leaving",
  undecided: "Undecided",
};

/** Most people one cycle position can hire. */
export const MAX_POSITION_OPENINGS = 50;

/** Longest offer response window (2 weeks). */
export const MAX_OFFER_RESPONSE_HOURS = 336;

export const QUESTION_TYPES = [
  "text",
  "textarea",
] as const satisfies readonly ApplicationInputType[];

export const QUESTION_TYPE_LABELS: Record<ApplicationInputType, string> = {
  text: "Short answer",
  textarea: "Long answer",
};
