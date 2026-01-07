import { NextRequest, NextResponse } from "next/server";
import { EventService } from "@uwdsc/server/cxc/services/eventService";
import { ProfileService } from "@uwdsc/server/cxc/services/profileService";
import { createAuthService } from "@/lib/services";

const eventService = new EventService();
const profileService = new ProfileService();

/**
 * POST /api/admin/checkin
 * Check in a user for an event using NFC ID
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authService = await createAuthService();
    const { user, error: userError } = await authService.getCurrentUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const adminProfile = await profileService.getProfileByUserId(user.id);
    if (adminProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden", message: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { nfc_id, event_id } = body;

    if (!nfc_id || !event_id) {
      return NextResponse.json(
        { error: "Bad Request", message: "Missing nfc_id or event_id" },
        { status: 400 },
      );
    }

    // Get profile by NFC ID
    const profile = await profileService.getProfileByNfcId(nfc_id);
    if (!profile) {
      return NextResponse.json(
        { error: "Not Found", message: "Profile not found for NFC ID" },
        { status: 404 },
      );
    }

    // Check in user
    const result = await eventService.checkInUser(
      Number(event_id),
      profile.id,
    );

    if (!result.success) {
      return NextResponse.json(
        { error: "Internal Server Error", message: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User checked in successfully",
        profile: {
          id: profile.id,
          role: profile.role,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error checking in user:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Failed to check in user",
      },
      { status: 500 },
    );
  }
}

