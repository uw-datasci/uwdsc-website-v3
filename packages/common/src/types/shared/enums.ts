// Shared enums and constants
// User roles, faculties, payment methods, etc.

export type UserRole = "member" | "exec" | "admin" | "pres" | "alum";

export type Faculty = "math" | "engineering" | "science" | "arts" | "health" | "environment";

export type PaymentMethod = "cash" | "online" | "math_soc";

export type ApplicationInputType = "text" | "textarea";

export type ApplicationStatus =
  "draft" | "submitted" | "under_review" | "accepted" | "rejected";

export type ApplicationReviewStatus =
  | "In Review"
  | "Interviewing"
  | "Wanted"
  | "Not Wanted"
  | "Offer Sent"
  | "Accepted Offer"
  | "Declined Offer"
  | "Rejection Sent";

export type MembershipFilter = "all" | "paid" | "paid-mathsoc";

export type TermType = "study" | "coop";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type SubmissionSource = "web_form" | "email";

export type ReviewDecision = "approved" | "rejected";

export type ContactSource = "contact_form" | "email";

// Recruiting (hiring.* enums)

export type CyclePhase = "leadership" | "setup" | "open" | "review" | "offers" | "finalized";

export type LeadershipKind = "continuing" | "appointed" | "public_hire";

export type CycleEventType =
  | "cycle_started"
  | "leadership_locked"
  | "leadership_edited"
  | "phase_changed"
  | "finalized";

export type NoteKind = "general" | "interview";

export type OfferResponse = "accepted" | "declined";

export type OfferResponseVia = "link" | "manual" | "expiry";
