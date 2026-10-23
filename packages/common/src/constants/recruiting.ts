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
