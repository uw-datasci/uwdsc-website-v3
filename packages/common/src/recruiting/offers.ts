import type { SelectionStatus } from "./status";

/** The fields offer and rejection rules need from a card. */
export interface DecisionCard {
  selectionId: string;
  applicationId: string;
  name: string;
  positionId: number;
  positionName: string;
  status: SelectionStatus;
}

export interface SeatState {
  positionId: number;
  openings: number;
  filled: number;
  held: number;
  left: number;
  heldBy: string[];
}

/** Seats per position: openings minus accepted minus offers still out. */
export function seatState(
  openings: ReadonlyMap<number, number>,
  cards: readonly DecisionCard[]
): Map<number, SeatState> {
  const seats = new Map<number, SeatState>();
  for (const [positionId, count] of openings) {
    seats.set(positionId, {
      positionId,
      openings: count,
      filled: 0,
      held: 0,
      left: count,
      heldBy: [],
    });
  }
  for (const card of cards) {
    const seat = seats.get(card.positionId);
    if (!seat) continue;
    if (card.status === "Accepted Offer") seat.filled += 1;
    if (card.status === "Offer Sent") {
      seat.held += 1;
      seat.heldBy.push(card.name);
    }
  }
  for (const seat of seats.values())
    seat.left = Math.max(0, seat.openings - seat.filled - seat.held);
  return seats;
}

/** Why this card can't get an offer right now, or null if it can. */
export function offerBlocker(
  card: DecisionCard,
  candidateCards: readonly DecisionCard[],
  seats: ReadonlyMap<number, SeatState>
): string | null {
  if (card.status !== "Wanted") return "Only Wanted candidates can get an offer.";
  if (candidateCards.some((other) => other.status === "Accepted Offer")) {
    return "Already accepted another offer.";
  }
  const seat = seats.get(card.positionId);
  if (!seat || seat.left > 0) return null;
  if (seat.heldBy.length > 0) return `Seat held for ${seat.heldBy.join(", ")}`;
  return "Every seat is filled.";
}

export type RejectionGroup = "notWanted" | "inReview" | "interviewing";

export const REJECTION_GROUP_LABELS: Record<RejectionGroup, string> = {
  notWanted: "Not Wanted",
  inReview: "Never reviewed",
  interviewing: "Still Interviewing",
};

export interface RejectionRecipient {
  applicationId: string;
  name: string;
  group: RejectionGroup;
  selectionIds: string[];
  positionNames: string[];
}

export interface RejectionBatch {
  recipients: RejectionRecipient[];
  counts: Record<RejectionGroup, number>;
  skipped: number;
  skippedExample: { name: string; status: SelectionStatus; positionName: string } | null;
}

const KEEP_STATUSES: readonly SelectionStatus[] = [
  "Wanted",
  "Offer Sent",
  "Accepted Offer",
  "Declined Offer",
];

function groupByCandidate(cards: readonly DecisionCard[]): Map<string, DecisionCard[]> {
  const groups = new Map<string, DecisionCard[]>();
  for (const card of cards) {
    const group = groups.get(card.applicationId);
    if (group) group.push(card);
    else groups.set(card.applicationId, [card]);
  }
  return groups;
}

function furthestGroup(cards: readonly DecisionCard[]): RejectionGroup {
  if (cards.some((card) => card.status === "Interviewing")) return "interviewing";
  if (cards.some((card) => card.status === "In Review")) return "inReview";
  return "notWanted";
}

/**
 * Who gets the batch rejection: candidates with no card that's Wanted or past an offer,
 * grouped by their furthest review status. One email per candidate.
 */
export function rejectionBatch(
  cards: readonly DecisionCard[],
  include: Readonly<Record<RejectionGroup, boolean>>
): RejectionBatch {
  const result: RejectionBatch = {
    recipients: [],
    counts: { notWanted: 0, inReview: 0, interviewing: 0 },
    skipped: 0,
    skippedExample: null,
  };

  for (const [applicationId, group] of groupByCandidate(cards)) {
    const keep = group.find((card) => KEEP_STATUSES.includes(card.status));
    if (keep) {
      result.skipped += 1;
      result.skippedExample ??= {
        name: keep.name,
        status: keep.status,
        positionName: keep.positionName,
      };
      continue;
    }

    const open = group.filter((card) => card.status !== "Rejection Sent");
    if (open.length === 0) continue;

    const kind = furthestGroup(open);
    result.counts[kind] += 1;
    if (!include[kind]) continue;

    result.recipients.push({
      applicationId,
      name: open[0]?.name ?? "",
      group: kind,
      selectionIds: open.map((card) => card.selectionId),
      positionNames: open.map((card) => card.positionName),
    });
  }

  result.recipients.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

/**
 * The cards an individual rejection moves (Wanted / Not Wanted), or why it can't be sent
 * yet. Cards still in review go through the batch instead.
 */
export function individualRejection(
  candidateCards: readonly DecisionCard[]
): { ok: true; selectionIds: string[] } | { ok: false; reason: string } {
  const open = candidateCards.filter(
    (card) => card.status !== "Rejection Sent" && card.status !== "Declined Offer"
  );
  if (open.some((card) => card.status === "Offer Sent" || card.status === "Accepted Offer")) {
    return { ok: false, reason: "They have an offer out or accepted." };
  }
  if (open.some((card) => card.status === "In Review" || card.status === "Interviewing")) {
    return {
      ok: false,
      reason: "Some positions are still in review. Move them to Not Wanted first.",
    };
  }
  if (open.length === 0) return { ok: false, reason: "They've already been sent a rejection." };
  return { ok: true, selectionIds: open.map((card) => card.selectionId) };
}
