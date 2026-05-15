import { ApiResponse } from "@uwdsc/common/utils";
import { profileService } from "@uwdsc/core";
import { createAuthService } from "@/lib/services";

/**
 * GET /api/auth/user
 * Get the currently authenticated user.
 * Returns 200 with JSON `null` when there is no session (public pages, password-recovery
 * before verify-recovery, etc.) so clients can bootstrap auth without surfacing 401s.
 */
export async function GET(): Promise<Response> {
  try {
    const authService = await createAuthService();
    const { user } = await authService.getCurrentUser();

    if (!user) return ApiResponse.json(null, 200);

    // Extract role from app_metadata
    const role = user.app_metadata?.role ?? null;

    // Fetch profile using user.id
    const profile = await profileService.getProfileByUserId(user.id);

    // Flatten user and profile data into a single object
    const data = {
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
    };
    return ApiResponse.ok(data);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return ApiResponse.serverError(error, "Failed to fetch user");
  }
}
