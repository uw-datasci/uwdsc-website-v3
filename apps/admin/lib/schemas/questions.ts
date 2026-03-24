import { z } from "zod";

export const questionSchema = z.object({
  question_text: z.string().trim().min(1, "Question text is required"),
  type: z.enum(["text", "textarea"]),
  max_length: z.number().int().positive().nullable().optional(),
  placeholder: z.string().trim().max(500).nullable().optional(),
  help_text: z.string().trim().max(1000).nullable().optional(),
  sort_order: z.number().int().min(0, "Sort order must be at least 0"),
  position_id: z.number().int().positive().nullable(),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
