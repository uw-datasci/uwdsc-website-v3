// Shared enums and constants
// User roles, faculties, payment methods, etc.

export type UserRole = "member" | "exec" | "admin";

export type Faculty =
  | "math"
  | "engineering"
  | "science"
  | "arts"
  | "health"
  | "environment";

export type PaymentMethod = "cash" | "online" | "math_soc";

export type ApplicationInputType = "text" | "textarea";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected";

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
