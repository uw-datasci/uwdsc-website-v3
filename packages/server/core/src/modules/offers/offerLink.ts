import type { ApplicationReviewStatus, PublicOfferState } from "@uwdsc/common/types";

export interface OfferLinkRow {
  offer_id: string;
  selection_id: string;
  profile_id: string;
  cycle_id: string;
  status: ApplicationReviewStatus;
  full_name: string;
  position_name: string;
  subteam_name: string | null;
  target_term_code: string;
  expires_at: string;
  responded_at: string | null;
  response: "accepted" | "declined" | null;
  withdrawn_at: string | null;
  personal_line: string | null;
  accepted_elsewhere: string | null;
}

/** Which screen the offer page shows for this offer right now. */
export function offerLinkState(row: OfferLinkRow, now: Date = new Date()): PublicOfferState {
  if (row.response === "accepted") return "accepted";
  if (row.response === "declined") return "declined";
  if (row.withdrawn_at !== null || row.status !== "Offer Sent") return "closed";
  if (new Date(row.expires_at).getTime() <= now.getTime()) return "expired";
  return "open";
}
