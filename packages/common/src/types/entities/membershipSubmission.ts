import { ReviewDecision, SubmissionSource, SubmissionStatus } from "../shared/enums";

/** Uploaded proof of payment. Superseded uploads are kept with `is_current: false`. */
export interface SubmissionFile {
  id: string;
  object_key: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  is_current: boolean;
  uploaded_at: string;
}

/** One entry in a submission's append-only decision log. `reviewer` is null for automated (email) decisions. */
export interface SubmissionReview {
  id: string;
  decision: ReviewDecision;
  reason: string | null;
  reviewer_id: string | null;
  reviewer: string | null;
  created_at: string;
}

/**
 * A member's online proof-of-payment submission for one term.
 * The name/WatIAM/email fields are a snapshot taken at submit time, not a live
 * join against `profiles`.
 */
export interface MembershipSubmission {
  id: string;
  profile_id: string;
  term_id: string;
  term_code: string;
  status: SubmissionStatus;
  source: SubmissionSource;
  first_name: string;
  last_name: string;
  wat_iam: string;
  contact_email: string;
  /** Null for email-sourced submissions -- a receipt carries neither field. */
  program: string | null;
  is_coop_term: boolean | null;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

/** What the member's own `/membership` page renders. */
export interface MembershipSubmissionView {
  submission: MembershipSubmission | null;
  /** Signed URL for the current proof, minted per request. */
  proof_url: string | null;
  proof_file_name: string | null;
  /** True when a membership row already exists for the active term, by any payment method. */
  has_membership: boolean;
  term_code: string | null;
}

/** One row in the admin review queue. */
export interface SubmissionReviewItem extends MembershipSubmission {
  /** Live profile values, for comparison against the snapshot. */
  profile_first_name: string | null;
  profile_last_name: string | null;
  profile_wat_iam: string | null;
  profile_email: string;
  proof_url: string | null;
  proof_file_name: string | null;
  proof_mime_type: string | null;
  reviewer_name: string | null;
  /** Populated for `source: "email"` rows. */
  email_subject: string | null;
  email_from: string | null;
  email_body: string | null;
  review_history: SubmissionReview[];
}

export interface SubmitMembershipProofData {
  first_name: string;
  last_name: string;
  wat_iam: string;
  contact_email: string;
  program: string;
  is_coop_term: boolean;
  /** Storage object key returned by the proof upload endpoint. */
  proof_key: string;
  proof_file_name: string;
  proof_mime_type: string;
  proof_size_bytes: number;
}

export interface ReviewSubmissionData {
  decision: ReviewDecision;
  /** Required and non-empty when `decision` is `"rejected"`. */
  reason?: string;
}
