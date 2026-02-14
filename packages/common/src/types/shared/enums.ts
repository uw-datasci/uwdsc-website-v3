// Shared enums and constants
// User roles, faculties, payment methods, etc.

export type UserRole = "member" | "admin" | "exec";

export type Faculty =
  | "math"
  | "engineering"
  | "science"
  | "arts"
  | "health"
  | "environment"
  | "other_non_waterloo";

export type PaymentMethod = "cash" | "online" | "math_soc";

export type ApplicationInputType = "text" | "textarea";
