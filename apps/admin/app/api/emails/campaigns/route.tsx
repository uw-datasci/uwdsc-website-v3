import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { emailService } from "@uwdsc/admin";
import { after } from "next/server";
import { withAuth } from "@/guards/withAuth";
import { sendCampaignSchema } from "@/lib/schemas/emails";

/**
 * POST /api/emails/campaigns
 * Send an email campaign to users in the selected role audiences.
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

    const { subject, recipientRoles, body: emailBody } = validationResult.data;
    const result = await emailService.sendCampaignEmail({
      subject,
      recipientRoles,
      body: emailBody,
    });

    const { recipientEmails } = result;
    after(async () => {
      const delayMs = emailService.campaignSegmentCleanupDelayMs;
      if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
      await emailService.removeRecipientsFromSegment(recipientEmails);
    });

    return ApiResponse.ok({ success: true, id: result.id });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      if (error.statusCode === 400) {
        return ApiResponse.badRequest(error.message, error.code ?? "Validation error");
      }
      return ApiResponse.json(
        { error: error.code ?? "Error", message: error.message },
        error.statusCode,
      );
    }
    console.error("Error sending campaign:", error);
    return ApiResponse.serverError(error, "Failed to send campaign");
  }
});
