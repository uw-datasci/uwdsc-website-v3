import { z } from "zod";

export const contactSchema = z.object({
  name: z.string(),
  email: z.string(),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactDefaultValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};
