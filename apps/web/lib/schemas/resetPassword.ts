import { z } from "zod";

/**
 * Reset password form validation schema
 */

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Your password needs to be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const resetPasswordDefaultValues: Partial<ResetPasswordFormValues> = {
  password: "",
  confirmPassword: "",
};
