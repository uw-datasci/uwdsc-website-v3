import { z } from "zod";

/**
 * Application form validation schema.
 * general_answers: dynamic question_id -> answer_text (from API)
 * resumeKey: populated after file upload (replaces resumeUrl)
 */
export const applicationSchema = z
  .object({
    full_name: z.string().min(2, "Full name is required"),
    personal_email: z.email("Personal email is required"),
    waterloo_email: z
      .email("UWaterloo email is required")
      .regex(
        /@uwaterloo\.ca$/,
        "Must be a valid UWaterloo email (@uwaterloo.ca)",
      ),
    program: z.string().min(1, "Program is required"),
    academic_term: z.string().min(1, "Academic term is required"),
    location: z.string().min(1, "Location is required"),
    club_experience: z.boolean({
      message: "Please select whether you have past exec experience",
    }),
    general_answers: z.record(z.string(), z.string()),
    position_1: z.string().min(1, "Please select a position"),
    position_1_answers: z.record(z.string(), z.string()),
    position_2: z.string().optional(),
    position_2_answers: z.record(z.string(), z.string()).optional(),
    position_3: z.string().optional(),
    position_3_answers: z.record(z.string(), z.string()).optional(),
    resumeKey: z.string().min(1, "Please upload your resume"),
  })
  .refine(
    (data) => {
      if (data.position_1 && data.position_1 !== "") {
        const answers = data.position_1_answers || {};
        return (
          Object.values(answers).length > 0 &&
          Object.values(answers).every(
            (a) =>
              a && typeof a === "string" && a.length >= 10 && a.length <= 1000,
          )
        );
      }
      return true;
    },
    {
      message: "Please answer all questions for your selected position",
      path: ["position_1_answers"],
    },
  )
  .refine(
    (data) => {
      if (data.position_2 && data.position_2 !== "") {
        const answers = data.position_2_answers || {};
        return (
          Object.values(answers).length > 0 &&
          Object.values(answers).every(
            (a) =>
              a && typeof a === "string" && a.length >= 10 && a.length <= 1000,
          )
        );
      }
      return true;
    },
    {
      message: "Please answer all questions for your selected position",
      path: ["position_2_answers"],
    },
  )
  .refine(
    (data) => {
      if (data.position_3 && data.position_3 !== "") {
        const answers = data.position_3_answers || {};
        return (
          Object.values(answers).length > 0 &&
          Object.values(answers).every(
            (a) =>
              a && typeof a === "string" && a.length >= 10 && a.length <= 1000,
          )
        );
      }
      return true;
    },
    {
      message: "Please answer all questions for your selected position",
      path: ["position_3_answers"],
    },
  );

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
  resumeKey: "",
};
