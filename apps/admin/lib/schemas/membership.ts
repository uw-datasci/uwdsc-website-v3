import { z } from "zod";

/**
 * Schema for marking a member as paid
 * Used by admins to record payment information
 */
export const markAsPaidSchema = z.object({
  payment_method: z.enum(["cash", "online", "math_soc"], {
    message: "Payment method is required",
  }),
  payment_location: z.string().trim().min(1, "Payment location is required"),
  verifier: z.string().trim().min(1, "Verifier is required"),
});

export type MarkAsPaidFormValues = z.infer<typeof markAsPaidSchema>;

/**
 * Schema for editing member information (PATCH - partial updates)
 * All fields optional - only include fields to change
 */
export const editMemberSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").optional(),
  last_name: z.string().trim().min(1, "Last name is required").optional(),
  wat_iam: z.string().trim().optional(),
  faculty: z
    .enum([
      "math",
      "engineering",
      "science",
      "arts",
      "health",
      "environment",
    ])
    .optional(),
  term: z.string().trim().optional(),
  is_math_soc_member: z.boolean().optional(),
});

export type EditMemberFormValues = z.infer<typeof editMemberSchema>;
