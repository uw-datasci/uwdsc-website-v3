import { AuthService } from "@uwdsc/server/core/services/authService";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const authService = new AuthService();
    const result = await authService.login({ email, password });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 401 });
    }

    return Response.json({
      message: "Login successful",
      user: result.user,
      session: result.session,
      error: result.error, // Pass through any error (like "email_not_verified")
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
