import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { password } = body;

    if (typeof password !== "string" || password.length < 8) {
      return ApiResponse.badRequest(
        "Password must be at least 8 characters long",
      );
    }

    const authService = await createAuthService();
    const result = await authService.resetPassword(password);

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Failed to reset password");
    }

    return ApiResponse.ok({ success: true, message: result.message });
  } catch (error) {
    console.error("Reset password error:", error);
    return ApiResponse.serverError(error, "An unexpected error occurred");
  }
}
