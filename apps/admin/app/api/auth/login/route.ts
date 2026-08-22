import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

export const POST = withRaftRoute(async (request) => {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) return RaftResponse.badRequest("Email and password are required");

  const authService = await createAuthService();
  const result = await authService.login({ email, password });

  if (!result.success) {
    return RaftResponse.json(
      {
        error: result.error,
        needsVerification: result.needsVerification,
        email: result.email,
      },
      400
    );
  }

  return RaftResponse.ok({ success: true, user: result.user, session: result.session });
});
