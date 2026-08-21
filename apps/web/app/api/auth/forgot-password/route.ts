import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

export const POST = withRaftRoute(async (request) => {
  const body = await request.json();
  const { email } = body;

  if (!email) return RaftResponse.badRequest("Email is required");

  const authService = await createAuthService();
  const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password-confirm`;
  const result = await authService.forgotPassword(email, emailRedirectTo);

  if (!result.success) {
    return result.userNotFound
      ? RaftResponse.notFound(result.error)
      : RaftResponse.badRequest(result.error, "Failed to send password reset email");
  }

  return RaftResponse.ok({ success: true, message: result.message });
});
