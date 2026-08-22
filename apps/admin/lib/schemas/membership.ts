import { z } from "zod";
import { FACULTY_VALUES, ROLE_VALUES, roleRequiresSubteam } from "@uwdsc/common/constants";

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
  // Optional: when verifying at an active event, also check the member into it.
  event_id: z.string().uuid().optional(),
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
  faculty: z.enum(FACULTY_VALUES).optional(),
  term: z.string().trim().optional(),
  is_math_soc_member: z.boolean().optional(),
});

export type EditMemberFormValues = z.infer<typeof editMemberSchema>;

/**
 * Schema for updating a member's role.
 * President-only — enforced server-side by the `withPresAccess` route guard.
 */
/**
 * Role change plus the subteam it is scoped to. Mirrors the
 * `user_roles_subteam_matches_role` check constraint so the form surfaces the rule
 * before the request goes out.
 */
export const updateMemberRoleSchema = z
  .object({
    role: z.enum(ROLE_VALUES),
    subteam_id: z.number().int().nullable(),
  })
  .superRefine((data, ctx) => {
    if (roleRequiresSubteam(data.role) && data.subteam_id === null) {
      ctx.addIssue({
        code: "custom",
        path: ["subteam_id"],
        message: "Select a subteam for this role",
      });
    }

    if (!roleRequiresSubteam(data.role) && data.subteam_id !== null) {
      ctx.addIssue({
        code: "custom",
        path: ["subteam_id"],
        message: "This role cannot have a subteam",
      });
    }
  });

export type UpdateMemberRoleFormValues = z.infer<typeof updateMemberRoleSchema>;

/**
 * Invite a new member by email (admin invite flow).
 * Optional fields prefill the profile after auth creates the row via trigger.
 */
export const inviteMemberSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    first_name: z.string().trim().optional(),
    last_name: z.string().trim().optional(),
    wat_iam: z.string().trim().optional(),
    faculty: z.enum(FACULTY_VALUES).optional(),
    term: z.string().trim().optional(),
    is_math_soc_member: z.boolean().optional(),
  })
  .refine((data) => data.email.toLowerCase().endsWith("@uwaterloo.ca"), {
    message: "Please use your @uwaterloo.ca email address",
    path: ["email"],
  });

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
