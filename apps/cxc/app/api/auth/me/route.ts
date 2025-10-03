import { AuthService } from "@uwdsc/server/core/services/authService";

export async function GET() {
  try {
    const authService = new AuthService();
    const { user, error } = await authService.getCurrentUser();

    if (error) {
      return Response.json({ error: error }, { status: 401 });
    }

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        metadata: user.user_metadata,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Me endpoint error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
