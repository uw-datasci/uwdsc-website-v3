import { ApiResponse } from "@uwdsc/common/utils";
import { withAuth } from "@/guards/withAuth";
import { profileService } from "@uwdsc/core";
import { onboardingService } from "@uwdsc/admin";

/**
 * GET /api/auth/user
 * Get the currently authenticated user (admin/exec only)
 */
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const role = user.app_metadata?.role ?? null;
    const [profile, currentRoleId] = await Promise.all([
      profileService.getProfileByUserId(user.id),
      onboardingService.getCurrentExecRoleId(user.id),
    ]);

    const data = {
      id: user.id,
      email: user.email,
      role,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      wat_iam: profile?.wat_iam,
      faculty: profile?.faculty,
      current_role_id: currentRoleId,
    };
    return ApiResponse.ok(data);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return ApiResponse.serverError(error, "Failed to fetch user");
  }
});
