import { ApiResponse } from "@uwdsc/common/utils";
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
    try {
      const { role, subteamId, subteamName } = readRoleClaims(user.app_metadata);
      const [profile, positionId] = await Promise.all([
        profileService.getProfileByUserId(user.id),
        onboardingService.getExecPosId(user.id),
      ]);

      const data = {
        id: user.id,
        email: user.email,
        role,
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        wat_iam: profile?.wat_iam,
        faculty: profile?.faculty,
        position_id: positionId,
        subteam_id: subteamId,
        subteam_name: subteamName,
      };
      return ApiResponse.ok(data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      return ApiResponse.serverError(error, "Failed to fetch user");
    }
  },
  { allowAlum: true },
);
