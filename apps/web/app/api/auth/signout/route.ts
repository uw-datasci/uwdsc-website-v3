import { NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";

export async function POST(): Promise<NextResponse> {
  try {
    const authService = await createAuthService();
    const result = await authService.signOut();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
