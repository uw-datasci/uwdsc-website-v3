import { z } from "zod";

/**
 * Application form validation schema
 */
export const applicationSchema = z.object({
  // TODO: Add more fields as necessary
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Valid email is required"),
  program: z.string().min(1, "Program is required"),
  year_of_study: z.string().min(1, "Year of study is required"),
  university_name: z.string().min(1, "University name is required"),
  university_name_other: z.string().optional(),
  program_other: z.string().optional(),
});

/**
 * TypeScript type inferred from the schema
 */
export type AppFormValues = z.infer<typeof applicationSchema>;

/**
 * Default values for the form
 */
export const applicationDefaultValues: Partial<AppFormValues> = {
  // TODO: Add more fields to match schema
  first_name: "",
  last_name: "",
  dob: "",
  email: "",
  program: "",
  year_of_study: "",
  university_name: "",
  university_name_other: "",
  program_other: "",
};
