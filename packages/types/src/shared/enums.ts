// Shared enums and constants
// User roles, faculties, payment methods, etc.

// User role enum
export const UserRole = {
  MEMBER: "member",
  ADMIN: "admin",
  EXEC: "exec",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Faculty enum
export const Faculty = {
  MATH: "math",
  ENGINEERING: "engineering",
  SCIENCE: "science",
  ARTS: "arts",
  HEALTH: "health",
  ENVIRONMENT: "environment",
  OTHER_NON_WATERLOO: "other_non_waterloo",
} as const;

export type Faculty = (typeof Faculty)[keyof typeof Faculty];

// Payment method enum
export const PaymentMethod = {
  CASH: "cash",
  ONLINE: "online",
  MATH_SOC: "math_soc",
} as const;

export type PaymentMethod =
  (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Question type enum
export const QuestionType = {
  TEXT: "text",
  TEXTAREA: "textarea",
  MULTIPLE_CHOICE: "multiple_choice",
  FILE_UPLOAD: "file_upload",
  CHECKBOX: "checkbox",
  DATE: "date",
  NUMBER: "number",
} as const;

export type QuestionType =
  (typeof QuestionType)[keyof typeof QuestionType];
