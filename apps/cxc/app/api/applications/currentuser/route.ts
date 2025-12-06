import { NextResponse } from "next/server";
import { createAuthService } from "@/lib/services";

export async function GET() {
  try {
    const authService = await createAuthService();
    const { user, error } = await authService.getCurrentUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata.first_name,
        last_name: user.user_metadata.last_name,
      },
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
