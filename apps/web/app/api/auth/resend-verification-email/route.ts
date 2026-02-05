import { NextRequest, NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const authService = await createAuthService();
    const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/complete-profile`;
    const result = await authService.resendVerificationEmail(
      email,
      emailRedirectTo,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
