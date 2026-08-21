import { z } from "zod";

export const CAMPAIGN_RECIPIENT_ROLES = ["member", "exec", "admin"] as const;

export type CampaignRecipientRole = (typeof CAMPAIGN_RECIPIENT_ROLES)[number];

export const sendCampaignSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  recipientRoles: z
    .array(z.enum(CAMPAIGN_RECIPIENT_ROLES))
    .min(1, "Select at least one audience"),
  body: z.string().min(1, "Email body cannot be empty"),
});

export type SendCampaignFormValues = z.infer<typeof sendCampaignSchema>;
