import { z } from "zod";

/** Schema for the returning exec interest / submission form. */
export const returningExecSchema = z
  .object({
    email: z.email("Invalid email address"),
    full_name: z.string().min(1, "Full name is required"),
    discord: z.string().min(1, "Discord handle is required").max(64),
    past_positions: z
      .string()
      .min(1, "Please list your past positions and terms"),
    interested_in_returning: z.enum(["true", "false"]).optional(),
    not_returning_reason: z.string().optional(),
    first_choice_position: z.string().optional(),
    second_choice_position: z.string().optional(),
    third_choice_position: z.string().optional(),
    in_person_next_term: z.enum(["true", "false"]).optional(),
    qualifications: z.string().optional(),
    additional_notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.interested_in_returning === undefined) {
      ctx.addIssue({
        path: ["interested_in_returning"],
        code: "custom",
        message: "Please select Yes or No",
      });
      return;
    }
    const isReturning = data.interested_in_returning === "true";
    if (isReturning) {
      if (!data.first_choice_position) {
        ctx.addIssue({
          path: ["first_choice_position"],
          code: "custom",
          message: "Please select at least a first choice position",
        });
      }
      if (!data.in_person_next_term) {
        ctx.addIssue({
          path: ["in_person_next_term"],
          code: "custom",
          message: "Please indicate whether you will be in person",
        });
      }
      if (!data.qualifications?.trim()) {
        ctx.addIssue({
          path: ["qualifications"],
          code: "custom",
          message: "Please describe why you are interested/qualified",
        });
      }
    } else if (!data.not_returning_reason?.trim()) {
      ctx.addIssue({
        path: ["not_returning_reason"],
        code: "custom",
        message:
          "Please provide a brief explanation for not returning (optional but encouraged)",
      });
    }
  });

export type ReturningExecFormValues = z.infer<typeof returningExecSchema>;

export const ReturningExecDefaultValues: ReturningExecFormValues = {
  email: "",
  full_name: "",
  discord: "",
  past_positions: "",
  interested_in_returning: undefined,
  not_returning_reason: "",
  first_choice_position: "",
  second_choice_position: "",
  third_choice_position: "",
  in_person_next_term: undefined,
  qualifications: "",
  additional_notes: "",
};
