import { z } from "zod";

/**
 * Forgot password form validation schema
 */

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordDefaultValues: Partial<ForgotPasswordFormValues> = {
  email: "",
};
