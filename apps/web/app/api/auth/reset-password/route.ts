import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

export const POST = withRaftRoute(async (request) => {
  const body = await request.json();
  const { password } = body;

  if (typeof password !== "string" || password.length < 8) {
    return RaftResponse.badRequest("Password must be at least 8 characters long");
  }

  const authService = await createAuthService();
  const result = await authService.resetPassword(password);

  if (!result.success) return RaftResponse.badRequest(result.error, "Failed to reset password");

  return RaftResponse.ok({ success: true, message: result.message });
});
