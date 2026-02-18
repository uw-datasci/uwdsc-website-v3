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
    const result = await authService.login({ email, password });

    if (!result.success) {
      return ApiResponse.json(
        {
          error: result.error,
          needsVerification: result.needsVerification,
          email: result.email,
        },
        400,
      );
    }

    return ApiResponse.ok({
      success: true,
      user: result.user,
      session: result.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    return ApiResponse.serverError(error, "An unexpected error occurred");
  }
}
