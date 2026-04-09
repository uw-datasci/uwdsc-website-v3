import { z } from "zod";

/**
 * Complete profile form validation schema
 * Used after email verification to complete user registration
 */
export const completeProfileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  wat_iam: z.string().trim().min(1, "WatIAM is required"),
  faculty: z.string().min(1, "Faculty is required"),
  term: z.string().min(1, "Term is required"),
  heard_from_where: z
    .string()
    .trim()
    .min(1, "Please enter where you heard about us"),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export const completeProfileDefaultValues: Partial<CompleteProfileFormValues> =
  {
    first_name: "",
    last_name: "",
    wat_iam: "",
    faculty: "",
    term: "",
    heard_from_where: "",
  };

/** Passport profile edit (same base fields as complete profile, no heard_from_where) */
export const passportProfileEditSchema = completeProfileSchema.pick({
  first_name: true,
  last_name: true,
  wat_iam: true,
  faculty: true,
  term: true,
});

export type PassportProfileEditValues = z.infer<typeof passportProfileEditSchema>;

export const passportProfileEditDefaultValues: PassportProfileEditValues = {
  first_name: "",
  last_name: "",
  wat_iam: "",
  faculty: "",
  term: "",
};
