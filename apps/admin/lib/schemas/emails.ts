import { z } from "zod";

export const sendCampaignSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  recipients: z.string().min(1, "At least one recipient email is required"),
  body: z.string().min(1, "Email body cannot be empty"),
});

export type SendCampaignFormValues = z.infer<typeof sendCampaignSchema>;
