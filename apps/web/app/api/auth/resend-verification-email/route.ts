import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

export const POST = withRaftRoute(async (request) => {
  const body = await request.json();
  const { email } = body;

  if (!email) return RaftResponse.badRequest("Email is required");

  const authService = await createAuthService();
  const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/complete-profile`;
  const result = await authService.resendVerificationEmail(email, emailRedirectTo);

  if (!result.success) {
    return RaftResponse.badRequest(result.error, "Failed to resend verification email");
  }

  return RaftResponse.ok({ success: true, message: result.message });
});
