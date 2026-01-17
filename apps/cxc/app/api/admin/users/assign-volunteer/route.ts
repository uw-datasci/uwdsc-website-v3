import { NextResponse } from "next/server";
import { ProfileService } from "@uwdsc/server/cxc/services/profileService";
import { createAuthService } from "@/lib/services";

const profileService = new ProfileService();

/**
 * POST /api/admin/users/assign-volunteer
 * Assign hacker or volunteer role to a user
 * Admin or superadmin only endpoint
 * Body: { userId: string, role: "hacker" | "volunteer" }
 */
export async function POST(request: Request) {
  try {
    // Verify authentication
    const authService = await createAuthService();
    const { user, error: userError } = await authService.getCurrentUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is admin or superadmin
    const profile = await profileService.getProfileByUserId(user.id);
    if (profile?.role !== "admin" && profile?.role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden", message: "Admin or superadmin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Bad Request", message: "userId and role are required" },
        { status: 400 },
      );
    }

    // Validate role - only allow assigning hacker or volunteer role
    if (role !== "hacker" && role !== "volunteer") {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid role. Only 'hacker' or 'volunteer' roles can be assigned via this endpoint" },
        { status: 400 },
      );
    }

    // Prevent admin from changing their own role
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Bad Request", message: "Cannot change your own role" },
        { status: 400 },
      );
    }

    // Update user role
    const result = await profileService.updateUserRole(userId, role);

    if (!result.success) {
      return NextResponse.json(
        { error: "Internal server error", message: result.error || "Failed to update user role" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: `Successfully assigned role "${role}" to user` },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in user assign-volunteer route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 },
    );
  }
}
