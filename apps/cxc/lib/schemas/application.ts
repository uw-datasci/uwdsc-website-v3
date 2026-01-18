import { z } from "zod";

// ============================================================================
// Application Form Validation Schema
// ============================================================================

/**
 * CXC Hacker Application form validation schema
 *
 * Defines all form fields, validation rules, and error messages for the
 * application form. Fields are organized by section:
 * - Personal Info (contact details, preferences)
 * - Experience (education, hackathon experience)
 * - Portfolio (links to GitHub, LinkedIn, personal website)
 * - Questions (open-ended CXC-specific questions)
 */
export const applicationSchema = z.object({
  // ========================================================================
  // Application Metadata (Hidden Fields)
  // ========================================================================

  status: z
    .enum(["draft", "submitted", "accepted", "rejected", "waitlisted"])
    .optional(),
  submitted_at: z.date().optional(),

  // ========================================================================
  // Personal Information
  // ========================================================================

  // personal info
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9\s\-()+]+$/, "Invalid phone number format"),
  discord: z
    .string()
    .min(2, "Discord handle must be at least 2 characters")
    .max(32, "Discord handle must be at most 32 characters"),

  tshirt_size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  dietary_restrictions: z.enum([
    "None",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Halal",
    "Kosher",
    "Other",
  ]),
  dietary_restrictions_other: z.string().optional(),

  gender: z
    .enum(["Male", "Female", "Non-Binary", "Other", "Prefer not to say"])
    .optional(),
  ethnicity: z.array(z.string()).optional(),
  ethnicity_other: z.string().optional(),

  // ========================================================================
  // Education Information
  // ========================================================================

  university_name: z.string().min(1, "University name is required"),
  university_name_other: z.string().optional(),
  program: z.string().min(1, "Program is required"),
  program_other: z.string().optional(),
  year_of_study: z
    .string()
    .min(1, "Year of study is required")
    .refine(
      (val) =>
        [
          "1st Year",
          "2nd Year",
          "3rd Year",
          "4th Year",
          "5th Year+",
          "Masters",
          "PhD",
        ].includes(val),
      "Invalid year of study",
    ),
  age: z
    .number()
    .int("Age must be an integer")
    .gt(0, "Age must be greater than 0"),
  country_of_residence: z.string().min(1, "Country of residence is required"),
  country_of_residence_other: z.string().optional(),

  // ========================================================================
  // Experience Information
  // ========================================================================

  prior_hackathon_experience: z
    .array(z.enum(["None", "Hacker", "Judge", "Mentor", "Organizer"]))
    .min(1, "Please select at least one option"),
  hackathons_attended: z.enum(["0", "1", "2", "3", "4+"]),

  // ========================================================================
  // Portfolio Links
  // ========================================================================

  github: z
    .string()
    .regex(/^$|^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/, {
      message: "Invalid GitHub URL",
    })
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .regex(/^$|^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/, {
      message: "Invalid LinkedIn URL",
    })
    .optional()
    .or(z.literal("")),
  website_url: z
    .string()
    .regex(/^$|^https:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+\/?$/, {
      message: "Invalid website URL",
    })
    .optional()
    .or(z.literal("")),
  other_link: z.string().url().optional().or(z.literal("")),
  resume: z.instanceof(File).optional(),

  // ========================================================================
  // Application Questions
  // ========================================================================

  cxc_q1: z
    .string()
    .min(1, "This question is required")
    .max(500, "Your response is too long. Maximum length is 500 characters."),

  cxc_q2: z
    .string()
    .min(1, "This question is required")
    .max(200, "Your response is too long. Maximum length is 200 characters."),

  // ========================================================================
  // Team Members (for hackathon collaboration)
  // ========================================================================

  team_members: z.array(z.string()).optional(),
  mlh_agreed_code_of_conduct: z.boolean(),
  mlh_authorize_info_sharing: z.boolean(),
  mlh_email_opt_in: z.boolean(),
});

// ============================================================================
// TypeScript Types
// ============================================================================

/**
 * Inferred TypeScript type from the Zod schema
 */
export type AppFormValues = z.infer<typeof applicationSchema>;

// ============================================================================
// Default Form Values
// ============================================================================

/**
 * Default form values for initial form population
 */
export const applicationDefaultValues: Partial<AppFormValues> = {
  name: "",
  email: "",
  phone: "",
  discord: "",
  status: "draft",
  submitted_at: undefined,
  tshirt_size: undefined,
  dietary_restrictions: undefined,
  dietary_restrictions_other: "",
  gender: undefined,
  ethnicity: undefined,
  ethnicity_other: "",
  university_name: "",
  university_name_other: "",
  program: "",
  program_other: "",
  year_of_study: "",
  age: undefined,
  country_of_residence: undefined,
  country_of_residence_other: "",
  prior_hackathon_experience: [],
  hackathons_attended: undefined,
  github: "",
  linkedin: "",
  website_url: "",
  other_link: "",
  resume: undefined,
  cxc_q1: "",
  cxc_q2: "",
  team_members: [],
  mlh_agreed_code_of_conduct: false,
  mlh_authorize_info_sharing: false,
  mlh_email_opt_in: false,
};
