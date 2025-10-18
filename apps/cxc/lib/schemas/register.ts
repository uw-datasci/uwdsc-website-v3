import { z } from "zod";

/**
 * Registration form validation schema
 */

export const registrationSchema = z
  .object({
    first_name: z.string().trim().nonempty("First name is required"),
    last_name: z.string().trim().nonempty("Last name is required"),
    dob: z.string().nonempty("Date of birth is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Your password needs to be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const registrationDefaultValues: Partial<RegistrationFormValues> = {
  first_name: "",
  last_name: "",
  dob: "",
  email: "",
  password: "",
  confirmPassword: "",
};
