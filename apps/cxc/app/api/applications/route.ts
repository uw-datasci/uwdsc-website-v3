import { ApplicationService } from "@uwdsc/server/cxc/services/applicationService";
import { ProfileService } from "@uwdsc/server/cxc/services/profileService";
import { createAuthService } from "@/lib/services";
import { APPLICATION_DEADLINE } from "@/constants/application";
import { NextResponse, NextRequest } from "next/server";

// ============================================================================
// GET - Fetch application by profile ID
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const profileId = url.searchParams.get("profile_id");

  if (!profileId) {
    return NextResponse.json(
      { error: "Missing profile_id parameter" },
      { status: 400 },
    );
  }

  try {
    const applicationService = new ApplicationService();
    const application = await applicationService.getApplication(profileId);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST - Create new application
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if past deadline (unless admin/superadmin)
    const now = new Date();
    const isPastDeadline = now > APPLICATION_DEADLINE;

    if (isPastDeadline) {
      // Verify if user is admin or superadmin
      const authService = await createAuthService();
      const { user, error: userError } = await authService.getCurrentUser();

      if (userError || !user) {
        return NextResponse.json(
          { error: "Application deadline has passed" },
          { status: 403 },
        );
      }

      const profileService = new ProfileService();
      const profile = await profileService.getProfileByUserId(user.id);

      if (profile?.role !== "admin" && profile?.role !== "superadmin") {
        return NextResponse.json(
          { error: "Application deadline has passed" },
          { status: 403 },
        );
      }
    }

    const body = await request.json();
    const applicationService = new ApplicationService();

    await applicationService.createApplication(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}

// ============================================================================
// PATCH - Update existing application
// ============================================================================

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if past deadline (unless admin/superadmin)
    const now = new Date();
    const isPastDeadline = now > APPLICATION_DEADLINE;

    if (isPastDeadline) {
      // Verify if user is admin or superadmin
      const authService = await createAuthService();
      const { user, error: userError } = await authService.getCurrentUser();

      if (userError || !user) {
        return NextResponse.json(
          { error: "Application deadline has passed" },
          { status: 403 },
        );
      }

      const profileService = new ProfileService();
      const profile = await profileService.getProfileByUserId(user.id);

      if (profile?.role !== "admin" && profile?.role !== "superadmin") {
        return NextResponse.json(
          { error: "Application deadline has passed" },
          { status: 403 },
        );
      }
    }

    const body = await request.json();
    const { profile_id, ...updateData } = body;

    if (!profile_id) {
      return NextResponse.json(
        { error: "Missing profile_id" },
        { status: 400 },
      );
    }

    const applicationService = new ApplicationService();
    await applicationService.updateApplication(profile_id, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating application:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: `Failed to update application: ${errorMessage}` },
      { status: 500 },
    );
  }
}
