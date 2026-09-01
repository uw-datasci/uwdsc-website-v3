import { ApiError } from "@uwdsc/common/types";
import { RaftResponse } from "@uw-datasci/raft";
import { emailService, profileService } from "@uwdsc/admin";
import { scheduleBroadcastCleanup } from "@/lib/server/scheduleBroadcastCleanup";
import { withAdmin } from "@/guards/withAdmin";
import { sendCampaignSchema } from "@/lib/schemas/emails";

/**
 * POST /api/emails/campaigns
 * Send an email campaign to users in the selected role audiences.
 * Portal admin role only.
 *
 * Keeps its own try/catch rather than delegating to the shared `withRaftRoute`
 * shim: this route's ApiError→response mapping has a 400 branch and a
 * `code ?? "Error"` fallback that both differ from every other route.
 */
export const POST = withAdmin(async (request) => {
  try {
    const body = await request.json();
    const validationResult = sendCampaignSchema.safeParse(body);

    if (!validationResult.success) {
      return RaftResponse.badRequest(
        validationResult.error.issues[0]?.message ?? "Invalid data",
        "Validation error"
      );
    }

    const { subject, recipientRoles, body: emailBody } = validationResult.data;
    const resolvedEmails = await profileService.getEmailsByRoles(recipientRoles);
    if (resolvedEmails.length === 0) {
      return RaftResponse.badRequest(
        "No recipients found for the selected audiences",
        "Validation error"
      );
    }

    const result = await emailService.sendCampaignEmail(subject, emailBody, resolvedEmails);

    scheduleBroadcastCleanup(result.recipientEmails);

    return RaftResponse.ok({ success: true, id: result.id });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      switch (error.statusCode) {
        case 400:
          return RaftResponse.badRequest(error.message, error.code ?? "Validation error");
        case 403:
          return RaftResponse.forbidden(error.message, error.code ?? "Error");
        default:
          return RaftResponse.json(
            { error: error.code ?? "Error", message: error.message },
            error.statusCode
          );
      }
    }
    console.error("Error sending campaign:", error);
    return RaftResponse.serverError(error, "Failed to send campaign");
  }
});
