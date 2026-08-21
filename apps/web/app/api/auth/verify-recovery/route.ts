import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

export const POST = withRaftRoute(async (request) => {
  const body = await request.json();
  const { token_hash } = body;

  if (typeof token_hash !== "string" || token_hash.trim() === "") {
    return RaftResponse.badRequest("token_hash is required");
  }

  const authService = await createAuthService();
  const result = await authService.verifyOtp({
    token_hash: token_hash.trim(),
    type: "recovery",
  });

  if (!result.success) {
    return RaftResponse.badRequest(
      result.error ?? "Verification failed",
      "Failed to verify recovery link"
    );
  }

  return RaftResponse.ok({
    success: true,
    message: "Recovery session established",
  });
});
