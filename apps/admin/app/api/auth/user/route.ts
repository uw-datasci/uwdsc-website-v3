import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { profileService } from "@uwdsc/core";

/**
 * GET /api/auth/user
 * Get the currently authenticated user
 */
export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();

    if (isUnauthorized) return isUnauthorized;

    if (!user) return ApiResponse.notFound("User not found");

    // Extract role from app_metadata
    const role = user.app_metadata?.role ?? null;

    // Fetch profile using user.id
    const profile = await profileService.getProfileByUserId(user.id);

    // Flatten user and profile data into a single object
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
}
