import { z } from "zod";

/**
 * Application form validation schema.
 * general_answers: dynamic question_id -> answer_text (from API)
 * resumeKey: populated after file upload (replaces resumeUrl)
 */
export const applicationSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  personal_email: z.email("Personal email is required"),
  waterloo_email: z
    .email("UWaterloo email is required")
    .regex(/@uwaterloo\.ca$/, "Must be a valid UWaterloo email (@uwaterloo.ca)"),
  program: z.string().min(1, "Program is required"),
  academic_term: z.string().min(1, "Academic term is required"),
  location: z.string().min(1, "Location is required"),
  club_experience: z.boolean({
    message: "Please select whether you have past exec experience",
  }),
  general_answers: z.record(z.string(), z.string().trim().min(1, "Answer is required")),
  position_1: z.string().min(1, "Please select a position"),
  position_1_answers: z.record(z.string(), z.string().trim().min(1, "Answer is required")),
  position_2: z.string().optional(),
  position_2_answers: z
    .record(z.string(), z.string().trim().min(1, "Answer is required"))
    .optional(),
  position_3: z.string().optional(),
  position_3_answers: z
    .record(z.string(), z.string().trim().min(1, "Answer is required"))
    .optional(),
  linkedin_url: z.url("Enter a valid LinkedIn URL"),
  github_url: z.url("Enter a valid GitHub URL"),
  portfolio_url: z.union([z.literal(""), z.url("Enter a valid URL")]).optional(),
  resumeKey: z.string().min(1, "Please upload your resume"),
});

export type AppFormValues = z.infer<typeof applicationSchema>;

export const applicationDefaultValues: Partial<AppFormValues> = {
  full_name: "",
  personal_email: "",
  waterloo_email: "",
  program: "",
  academic_term: "",
  location: "",
  club_experience: undefined,
  general_answers: {},
  position_1: "",
  position_1_answers: {},
  position_2: "",
  position_2_answers: {},
  position_3: "",
  position_3_answers: {},
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
  resumeKey: "",
};
