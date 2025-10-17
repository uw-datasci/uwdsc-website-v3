import { z } from "zod";

/**
 * Registration form validation schema
 */

export const registrationSchema = z.object({
  first_name: z.string().trim().nonempty("First name is required"),
  last_name: z.string().trim().nonempty("Last name is required"),
  wat_iam: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Your password needs to be at least 8 characters long"),
  faculty: z.string().nonempty("Faculty is required"),
  term: z.string().nonempty("Term is required"),
  heard_from_where: z
    .string()
    .trim()
    .nonempty("Please enter where you heard about us"),
  member_ideas: z.string().optional(),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const registrationDefaultValues: Partial<RegistrationFormValues> = {
  first_name: "",
  last_name: "",
  wat_iam: "",
  email: "",
  password: "",
  faculty: "",
  term: "",
  heard_from_where: "",
  member_ideas: "",
};
