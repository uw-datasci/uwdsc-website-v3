import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { createAuthService } from "@/lib/services";

export const POST = withRaftRoute(async () => {
  const authService = await createAuthService();
  const result = await authService.signOut();

  if (!result.success) return RaftResponse.badRequest(result.error, "Sign out failed");

  return RaftResponse.ok({ success: true, message: result.message });
});
