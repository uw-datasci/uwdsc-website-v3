import type { ApplicationReviewStatus } from "../types/shared/enums";

/**
 * Recruiting status rules: the single source of truth for which status moves are
 * allowed on a candidate × position card, and who can make them. Used by both the
 * admin UI (to dim columns / disable controls) and the services (to enforce).
 *
 * Subteam scope ("VPs only move their own subteam's cards") is NOT checked here;
 * see `capabilities.ts`.
 */

export type SelectionStatus = ApplicationReviewStatus;

/** The four review columns. Cards move freely between these by drag. */
export const REVIEW_STATUSES = [
  "In Review",
  "Interviewing",
  "Wanted",
  "Not Wanted",
] as const satisfies readonly SelectionStatus[];

/** Statuses reached only through send/response actions. Cards never leave these for a review column. */
export const DECISION_STATUSES = [
  "Offer Sent",
  "Accepted Offer",
  "Declined Offer",
  "Rejection Sent",
] as const satisfies readonly SelectionStatus[];

/** Board column order. */
export const SELECTION_STATUSES = [
  ...REVIEW_STATUSES,
  ...DECISION_STATUSES,
] as const satisfies readonly SelectionStatus[];

/** Display labels (the DB enum says "Accepted Offer"; the UI says "Accepted"). */
export const STATUS_LABELS: Record<SelectionStatus, string> = {
  "In Review": "In Review",
  Interviewing: "Interviewing",
  Wanted: "Wanted",
  "Not Wanted": "Not Wanted",
  "Offer Sent": "Offer Sent",
  "Accepted Offer": "Accepted",
  "Declined Offer": "Declined",
  "Rejection Sent": "Rejection Sent",
};

export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export function isReviewStatus(status: SelectionStatus): status is ReviewStatus {
  return (REVIEW_STATUSES as readonly SelectionStatus[]).includes(status);
}

/**
 * Who is acting. `candidate` is the applicant responding through the offer link;
 * `system` is the server acting on its own (offer expiry, auto-declining sibling offers).
 */
export type RecruitingActorRole = "pres" | "vp" | "candidate" | "system";

/** How the move is being made. */
export type TransitionAction =
  | "drag"
  | "send_offer"
  | "send_rejection"
  | "batch_rejection"
  | "offer_response"
  | "manual_response"
  | "correction"
  | "offer_expiry"
  | "sibling_accepted"
  | "offer_closed"
  | "withdraw_offer";

export interface RecruitingActor {
  role: RecruitingActorRole;
  action: TransitionAction;
}

export type TransitionCheck = { ok: true } | { ok: false; reason: string };

interface ActionRule {
  roles: readonly RecruitingActorRole[];
  moves: ReadonlyArray<readonly [SelectionStatus, SelectionStatus]>;
  roleReason: string;
}

const reviewToReview = REVIEW_STATUSES.flatMap((from) =>
  REVIEW_STATUSES.filter((to) => to !== from).map((to) => [from, to] as const)
);

const ACTION_RULES: Record<TransitionAction, ActionRule> = {
  drag: {
    roles: ["pres", "vp"],
    moves: reviewToReview,
    roleReason: "Only presidents and VPs can move candidates.",
  },
  send_offer: {
    roles: ["pres"],
    moves: [["Wanted", "Offer Sent"]],
    roleReason: "Only presidents can send offers.",
  },
  send_rejection: {
    roles: ["pres"],
    moves: [
      ["Not Wanted", "Rejection Sent"],
      ["Wanted", "Rejection Sent"],
    ],
    roleReason: "Only presidents can send rejections.",
  },
  batch_rejection: {
    roles: ["pres"],
    moves: [
      ["In Review", "Rejection Sent"],
      ["Interviewing", "Rejection Sent"],
      ["Not Wanted", "Rejection Sent"],
    ],
    roleReason: "Only presidents can send rejections.",
  },
  offer_response: {
    roles: ["candidate"],
    moves: [
      ["Offer Sent", "Accepted Offer"],
      ["Offer Sent", "Declined Offer"],
    ],
    roleReason: "Only the candidate can respond through the offer link.",
  },
  manual_response: {
    roles: ["pres"],
    moves: [
      ["Offer Sent", "Accepted Offer"],
      ["Offer Sent", "Declined Offer"],
    ],
    roleReason: "Only presidents can record offer responses.",
  },
  correction: {
    roles: ["pres"],
    moves: [
      ["Accepted Offer", "Declined Offer"],
      ["Declined Offer", "Accepted Offer"],
    ],
    roleReason: "Only presidents can correct offer responses.",
  },
  offer_expiry: {
    roles: ["system"],
    moves: [["Offer Sent", "Declined Offer"]],
    roleReason: "Offers expire automatically.",
  },
  sibling_accepted: {
    roles: ["system"],
    moves: [["Offer Sent", "Declined Offer"]],
    roleReason: "Other offers are declined automatically when one is accepted.",
  },
  offer_closed: {
    roles: ["pres", "system"],
    moves: [["Offer Sent", "Declined Offer"]],
    roleReason: "Only presidents can close offers.",
  },
  withdraw_offer: {
    roles: ["pres"],
    moves: [["Offer Sent", "Declined Offer"]],
    roleReason: "Only presidents can withdraw offers.",
  },
};

function moveReason(
  from: SelectionStatus,
  to: SelectionStatus,
  action: TransitionAction
): string {
  if (from === to) return `Already ${STATUS_LABELS[to]}.`;
  if (!isReviewStatus(from) && isReviewStatus(to)) {
    return `Candidates at ${STATUS_LABELS[from]} can't go back to review.`;
  }
  if (action === "drag" && !isReviewStatus(to)) {
    return `${STATUS_LABELS[to]} is set by sending or responding to an offer, not by dragging.`;
  }
  return `Can't move from ${STATUS_LABELS[from]} to ${STATUS_LABELS[to]} this way.`;
}

/** Like {@link canTransition}, but says why a move isn't allowed (for UI copy and API 400s). */
export function explainTransition(
  from: SelectionStatus,
  to: SelectionStatus,
  actor: RecruitingActor
): TransitionCheck {
  const rule = ACTION_RULES[actor.action];
  const moveAllowed = rule.moves.some(([f, t]) => f === from && t === to);
  if (!moveAllowed) return { ok: false, reason: moveReason(from, to, actor.action) };
  if (!rule.roles.includes(actor.role)) return { ok: false, reason: rule.roleReason };
  return { ok: true };
}

/** Whether `actor` may move a card from `from` to `to`. */
export function canTransition(
  from: SelectionStatus,
  to: SelectionStatus,
  actor: RecruitingActor
): boolean {
  return explainTransition(from, to, actor).ok;
}

/** The review columns a card at `from` can be dragged into (empty once it's past review). */
export function dragTargets(from: SelectionStatus): ReviewStatus[] {
  if (!isReviewStatus(from)) return [];
  return REVIEW_STATUSES.filter((to) => to !== from);
}
