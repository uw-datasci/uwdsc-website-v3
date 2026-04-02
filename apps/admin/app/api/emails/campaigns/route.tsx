import { Resend } from "resend";
import { render } from "@react-email/render";
import { ApiResponse } from "@uwdsc/common/utils";
import { withAuth } from "@/guards/withAuth";
import { sendCampaignSchema } from "@/lib/schemas/emails";
import { CampaignEmailTemplate } from "@/components/campaigns/CampaignEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/emails/campaigns
 * Send an email campaign to the given recipients.
 * Admin/exec only.
 */
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const validationResult = sendCampaignSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(
        validationResult.error.issues[0]?.message ?? "Invalid data",
        "Validation error",
      );
    }

    const { subject, recipients, body: emailBody } = validationResult.data;

    const recipientList = recipients
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    if (recipientList.length === 0) {
      return ApiResponse.badRequest(
        "At least one valid recipient email is required",
        "Validation error",
      );
    }

    const html = await render(
      <CampaignEmailTemplate subject={subject} body={emailBody} />,
    );

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "UWDSC <noreply@uwdsc.ca>",
      to: recipientList,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return ApiResponse.serverError(error, "Failed to send campaign");
    }

    return ApiResponse.ok({ success: true, id: data?.id });
  } catch (error: unknown) {
    console.error("Error sending campaign:", error);
    return ApiResponse.serverError(error, "Failed to send campaign");
  }
});
