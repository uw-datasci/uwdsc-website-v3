import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) return ApiResponse.badRequest("Email is required");

    const authService = await createAuthService();
    const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/reset-password`;
    const result = await authService.forgotPassword(email, emailRedirectTo);

    if (!result.success) {
      return ApiResponse.badRequest(
        result.error,
        "Failed to send password reset email",
      );
    }

    return ApiResponse.ok({ success: true, message: result.message });
  } catch (error) {
    console.error("Forgot password error:", error);
    return ApiResponse.serverError(error, "An unexpected error occurred");
  }
}
