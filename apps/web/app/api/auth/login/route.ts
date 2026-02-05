import { NextRequest, NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const authService = await createAuthService();
    const result = await authService.login({ email, password });

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          needsVerification: result.needsVerification,
          email: result.email,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      session: result.session,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
