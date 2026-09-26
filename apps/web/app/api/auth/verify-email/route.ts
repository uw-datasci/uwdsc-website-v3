import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

/**
 * Confirms a signup email from the /confirm-email buffer page. This is a POST (not the
 * GET callback) so enterprise email scanners that prefetch links can't consume the
 * single-use token before the user opens the email.
 */
export const POST = withRaftRoute(async (request) => {
  const body = await request.json();
  const { token_hash } = body;

  if (typeof token_hash !== "string" || token_hash.trim() === "") {
    return RaftResponse.badRequest("token_hash is required");
  }

  const authService = await createAuthService();
  const result = await authService.verifyOtp({
    token_hash: token_hash.trim(),
    type: "email",
  });

  if (!result.success) {
    return RaftResponse.badRequest(
      result.error ?? "Verification failed",
      "Failed to verify email"
    );
  }

  return RaftResponse.ok({
    success: true,
    message: "Email verified",
  });
});
