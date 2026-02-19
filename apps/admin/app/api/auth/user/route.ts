import { ApiResponse } from "@uwdsc/common/utils";
import { withAuth } from "@/lib/guards/withAuth";
import { profileService } from "@uwdsc/core";

/**
 * GET /api/auth/user
 * Get the currently authenticated user (admin/exec only)
 */
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const role = user.app_metadata?.role ?? null;
    const profile = await profileService.getProfileByUserId(user.id);

    const data = {
      email: user.email,
      role,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      wat_iam: profile?.wat_iam,
      faculty: profile?.faculty,
    };
    return ApiResponse.ok(data);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return ApiResponse.serverError(error, "Failed to fetch user");
  }
});
