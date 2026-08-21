import z from "zod";

/**
 * Mailing List form validation schema
 */

export const mailingListSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type MailingListFormValues = z.infer<typeof mailingListSchema>;

export const mailingListDefaultValues: MailingListFormValues = {
  email: "",
};
