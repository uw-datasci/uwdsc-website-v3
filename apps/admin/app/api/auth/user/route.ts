import { RaftResponse } from "@uw-datasci/raft";
import { withAuth } from "@/guards/withAuth";
import { profileService } from "@uwdsc/core";
import { onboardingService } from "@uwdsc/admin";
import { readRoleClaims } from "@uwdsc/common/constants";

/**
 * GET /api/auth/user
 * Get the currently authenticated user (admin/exec, plus alum for the returning-exec form's
 * `useAuth()`-driven name/email prefill).
 */
export const GET = withAuth(
  async (_request, _context, user) => {
    const { role, subteamId, subteamName } = readRoleClaims(user.app_metadata);
    const [profile, positionId] = await Promise.all([
      profileService.getProfileByUserId(user.id),
      onboardingService.getExecPosId(user.id)
    ]);

    return RaftResponse.ok({
      id: user.id,
      email: user.email,
      role,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      wat_iam: profile?.wat_iam,
      faculty: profile?.faculty,
      position_id: positionId,
      subteam_id: subteamId,
      subteam_name: subteamName
    });
  },
  { allowAlum: true }
);
