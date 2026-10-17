import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { profileService } from "@uwdsc/core";
import { createAuthService } from "@/lib/services";

/**
 * GET /api/auth/user
 * Get the currently authenticated user.
 * Returns 200 with JSON `null` when there is no session (public pages, password-recovery
 * before verify-recovery, etc.) so clients can bootstrap auth without surfacing 401s.
 */
export const GET = withRaftRoute(async () => {
  const authService = await createAuthService();
  const { user } = await authService.getCurrentUser();

  if (!user) return RaftResponse.json(null, 200);

  // Extract role from app_metadata
  const role = user.app_metadata?.role ?? null;

  // Fetch profile using user.id
  const profile = await profileService.getProfileByUserId(user.id);

  // Flatten user and profile data into a single object
  return RaftResponse.ok({
    id: user.id,
    email: user.email,
    role,
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    wat_iam: profile?.wat_iam,
    faculty: profile?.faculty,
    term: profile?.term ?? null,
    is_math_soc_member: profile?.is_math_soc_member ?? false,
    exec_position_name: profile?.exec_position_name ?? null,
    profile_photo_key: profile?.profile_photo_key ?? null,
  });
});
