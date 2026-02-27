import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";

export async function POST() {
  try {
    const authService = await createAuthService();
    const result = await authService.signOut();

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Sign out failed");
    }

    return ApiResponse.ok({ success: true, message: result.message });
  } catch (error) {
    console.error("Signout error:", error);
    return ApiResponse.serverError(error, "An unexpected error occurred");
  }
}
