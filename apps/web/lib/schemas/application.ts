import { z } from "zod";

/**
 * Application form validation schema
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
    exec_positions: z
      .string()
      .min(10, "Please provide at least 10 characters")
      .max(1000, "Please keep your response under 1000 characters"),
    new_idea: z
      .string()
      .min(10, "Please provide at least 10 characters")
      .max(1000, "Please keep your response under 1000 characters"),
    hobbies: z
      .string()
      .min(10, "Please provide at least 10 characters")
      .max(500, "Please keep your response under 500 characters"),
    // Position selections
    position_1: z.string().min(1, "Please select a position"),
    position_1_answers: z.record(z.string(), z.string()),
    position_2: z.string().optional(),
    position_2_answers: z.record(z.string(), z.string()).optional(),
    position_3: z.string().optional(),
    position_3_answers: z.record(z.string(), z.string()).optional(),
    resumeUrl: z.url({ message: "Must be a valid URL" }),
  })
  .refine(
    (data) => {
      // If position_1 is selected, all its answers must be provided
      if (data.position_1 && data.position_1 !== "") {
        const answers = data.position_1_answers || {};
        const answerValues = Object.values(answers);

        // Check if all answers are provided and meet length requirements
        return (
          answerValues.length > 0 &&
          answerValues.every(
            (answer) =>
              answer &&
              typeof answer === "string" &&
              answer.length >= 10 &&
              answer.length <= 1000,
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
      // If position_2 is selected, all its answers must be provided
      if (data.position_2 && data.position_2 !== "") {
        const answers = data.position_2_answers || {};
        const answerValues = Object.values(answers);

        return (
          answerValues.length > 0 &&
          answerValues.every(
            (answer) =>
              answer &&
              typeof answer === "string" &&
              answer.length >= 10 &&
              answer.length <= 1000,
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
      // If position_3 is selected, all its answers must be provided
      if (data.position_3 && data.position_3 !== "") {
        const answers = data.position_3_answers || {};
        const answerValues = Object.values(answers);

        return (
          answerValues.length > 0 &&
          answerValues.every(
            (answer) =>
              answer &&
              typeof answer === "string" &&
              answer.length >= 10 &&
              answer.length <= 1000,
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

/**
 * TypeScript type inferred from the schema
 */
export type AppFormValues = z.infer<typeof applicationSchema>;

/**
 * Default values for the form
 */
export const applicationDefaultValues: Partial<AppFormValues> = {
  full_name: "",
  personal_email: "",
  waterloo_email: "",
  program: "",
  academic_term: "",
  location: "",
  club_experience: undefined,
  exec_positions: "",
  new_idea: "",
  hobbies: "",
  position_1: "",
  position_1_answers: {},
  position_2: "",
  position_2_answers: {},
  position_3: "",
  position_3_answers: {},
  resumeUrl: "",
};
