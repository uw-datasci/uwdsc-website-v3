import { z } from "zod";

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: Partial<LoginFormValues> = {
  email: "",
  password: "",
};
