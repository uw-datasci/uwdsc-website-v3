import type {
  ApplicationReviewStatus,
  CycleEventType,
  CyclePhase,
  LeadershipKind,
  NoteKind,
  OfferResponse,
  OfferResponseVia,
  UserRole,
} from "../shared/enums";

// ==========================================
//  Row-level types (1:1 with hiring.* tables)
// ==========================================

/** Mirrors hiring.cycles. term_id = collection term, target_term_id = term being hired for. */
export interface HiringCycle {
  id: string;
  term_id: string;
  target_term_id: string;
  phase: CyclePhase;
  roster_locked_at: string | null;
  offer_response_hours: number;
  finalized_at: string | null;
  finalized_by: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  leadership_draft: unknown;
}

/** Mirrors hiring.application_positions_available. cycle_id is null for pre-cycle rows. */
export interface CyclePosition {
  id: number;
  cycle_id: string | null;
  position_id: number;
  is_open: boolean;
  openings: number;
}

/** Mirrors hiring.cycle_leadership. Co-VPs are two rows with the same position_id. */
export interface CycleLeadership {
  id: string;
  cycle_id: string;
  profile_id: string;
  role: Extract<UserRole, "pres" | "admin">;
  position_id: number;
  subteam_id: number;
  kind: LeadershipKind;
  confirmed_by: string | null;
  confirmed_at: string;
  prior_role: UserRole | null;
  prior_subteam_id: number | null;
}

/** Mirrors hiring.cycle_events. */
export interface CycleEvent {
  id: string;
  cycle_id: string;
  actor_id: string | null;
  type: CycleEventType;
  payload: Record<string, unknown>;
  created_at: string;
}

/** Mirrors hiring.selection_events. actor_id is null for system/candidate actions. */
export interface SelectionEvent {
  id: string;
  selection_id: string;
  actor_id: string | null;
  from_status: ApplicationReviewStatus | null;
  to_status: ApplicationReviewStatus;
  reason: string | null;
  created_at: string;
}

/** Mirrors hiring.candidate_notes. Soft-deleted via deleted_at. */
export interface CandidateNote {
  id: string;
  cycle_id: string;
  candidate_profile_id: string;
  author_id: string | null;
  author_role_label: string;
  kind: NoteKind;
  body: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/** Mirrors hiring.offers. */
export interface Offer {
  id: string;
  selection_id: string;
  token_hash: string | null;
  sent_at: string;
  expires_at: string;
  email_id: string | null;
  responded_at: string | null;
  response: OfferResponse | null;
  responded_via: OfferResponseVia | null;
  withdrawn_at: string | null;
  sent_by: string | null;
}
