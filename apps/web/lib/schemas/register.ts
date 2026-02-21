import { z } from "zod";

// ==========================================
//  Register form validation schema
// ==========================================

export const registerSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Your password needs to be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.email.toLowerCase().endsWith("@uwaterloo.ca"), {
    message: "Please use your @uwaterloo.ca email address",
    path: ["email"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const registerDefaultValues: Partial<RegisterFormValues> = {
  email: "",
  password: "",
  confirmPassword: "",
};

// ==========================================
//  Complete profile form validation schema
// ==========================================

export const registrationSchema = z
  .object({
    first_name: z.string().trim().nonempty("First name is required"),
    last_name: z.string().trim().nonempty("Last name is required"),
    wat_iam: z.string().optional(),
    email: z.email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Your password needs to be at least 8 characters long"),
    confirmPassword: z.string(),
    faculty: z.string().nonempty("Faculty is required"),
    term: z.string().nonempty("Term is required"),
    heard_from_where: z
      .string()
      .trim()
      .nonempty("Please enter where you heard about us"),
    member_ideas: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const registrationDefaultValues: Partial<RegistrationFormValues> = {
  first_name: "",
  last_name: "",
  wat_iam: "",
  email: "",
  password: "",
  confirmPassword: "",
  faculty: "",
  term: "",
  heard_from_where: "",
  member_ideas: "",
};
