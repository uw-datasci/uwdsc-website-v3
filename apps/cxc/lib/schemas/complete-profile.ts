import { z } from "zod";

/**
 * Complete profile form validation schema for CXC
 * Used after email verification to complete user registration
 * CXC Profile includes: first_name, last_name, dob, role, nfc_id
 */
export const completeProfileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export const completeProfileDefaultValues: Partial<CompleteProfileFormValues> =
  {
    first_name: "",
    last_name: "",
    dob: "",
  };
