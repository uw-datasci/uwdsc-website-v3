import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) return ApiResponse.badRequest("Email is required");

    const authService = await createAuthService();
    const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/complete-profile`;
    const result = await authService.resendVerificationEmail(email, emailRedirectTo);

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Failed to resend verification email");
    }

    return ApiResponse.ok({ success: true, message: result.message });
  } catch (error) {
    console.error("Resend verification error:", error);
    return ApiResponse.serverError(error, "An unexpected error occurred");
  }
}
