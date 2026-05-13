import { ApiResponse } from "@uwdsc/common/utils";
import { createAuthService } from "@/lib/services";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { token_hash } = body;

    if (typeof token_hash !== "string" || token_hash.trim() === "") {
      return ApiResponse.badRequest("token_hash is required");
    }

    const authService = await createAuthService();
    const result = await authService.verifyOtp({
      token_hash: token_hash.trim(),
      type: "recovery",
    });

    if (!result.success) {
      return ApiResponse.badRequest(
        result.error ?? "Verification failed",
        "Failed to verify recovery link",
      );
    }

    return ApiResponse.ok({ success: true, message: "Recovery session established" });
  } catch (error) {
    console.error("Verify recovery error:", error);
    return ApiResponse.serverError(error, "An unexpected error occurred");
  }
}
