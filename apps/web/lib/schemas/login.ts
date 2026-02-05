import { z } from "zod";

/**
 * Login form validation schema
 */

export const loginSchema = z.object({
  email: z.string().trim().nonempty("Please enter your email"),
  password: z.string().nonempty("Please enter your password"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: Partial<LoginFormValues> = {
  email: "",
  password: "",
};
