import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

export const POST = withRaftRoute(async (request) => {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) return RaftResponse.badRequest("Email and password are required");

  const authService = await createAuthService();
  const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/complete-profile`;
  const result = await authService.register({
    email,
    password,
    emailRedirectTo,
  });

  if (!result.success) return RaftResponse.badRequest(result.error, "Registration failed");

  return RaftResponse.ok({
    success: true,
    user: result.user,
    session: result.session,
    needsEmailConfirmation: result.needsEmailConfirmation,
    message: result.message,
  });
});
