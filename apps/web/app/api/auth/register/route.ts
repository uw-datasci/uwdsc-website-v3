import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return ApiResponse.badRequest("Email and password are required");
    }

    const authService = await createAuthService();
    const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/complete-profile`;
    const result = await authService.register({
      email,
      password,
      emailRedirectTo,
    });

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Registration failed");
    }

    const data = {
      success: true,
      user: result.user,
      session: result.session,
      needsEmailConfirmation: result.needsEmailConfirmation,
      message: result.message,
    };

    return ApiResponse.ok(data);
  } catch (error) {
    console.error("Registration error:", error);
    return ApiResponse.serverError(error, "An unexpected error occurred");
  }
}
