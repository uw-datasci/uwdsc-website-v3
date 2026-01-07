import { NextRequest, NextResponse } from "next/server";
import { EventService } from "@uwdsc/server/cxc/services/eventService";
import { createAuthService } from "@/lib/services";
import { ProfileService } from "@uwdsc/server/cxc/services/profileService";

const eventService = new EventService();
const profileService = new ProfileService();

/**
 * GET /api/admin/events
 * Get all events
 * Admin only endpoint
 */
export async function GET() {
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
    const profile = await profileService.getProfileByUserId(user.id);
    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden", message: "Admin access required" },
        { status: 403 },
      );
    }

    const events = await eventService.getAllEvents();
    return NextResponse.json({ events }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Failed to fetch events",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/events
 * Create a new event
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  console.log("[API] POST /api/admin/events - Starting");
  try {
    // Verify admin access
    console.log("[API] Creating auth service...");
    const authService = await createAuthService();
    console.log("[API] Getting current user...");
    const { user, error: userError } = await authService.getCurrentUser();

    if (userError || !user) {
      console.log("[API] Authentication failed:", userError);
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    console.log("[API] User authenticated:", user.id);

    // Check if user is admin
    console.log("[API] Checking admin role...");
    const profile = await profileService.getProfileByUserId(user.id);
    console.log("[API] Profile:", profile);
    if (profile?.role !== "admin") {
      console.log("[API] User is not admin, role:", profile?.role);
      return NextResponse.json(
        { error: "Forbidden", message: "Admin access required" },
        { status: 403 },
      );
    }

    console.log("[API] Parsing request body...");
    const body = await request.json();
    console.log("[API] Request body:", body);
    const {
      name,
      registration_required,
      description,
      location,
      start_time,
      buffered_start_time,
      end_time,
      buffered_end_time,
      payment_required,
      image_id,
    } = body;

    // Validate required fields
    console.log("[API] Validating required fields...");
    if (!name || !start_time || !buffered_start_time || !end_time || !buffered_end_time) {
      console.log("[API] Validation failed - missing fields:", {
        name: !!name,
        start_time: !!start_time,
        buffered_start_time: !!buffered_start_time,
        end_time: !!end_time,
        buffered_end_time: !!buffered_end_time,
      });
      return NextResponse.json(
        { error: "Bad Request", message: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("[API] Creating event with data:", {
      name,
      registration_required: registration_required ?? false,
      description,
      location,
      start_time: new Date(start_time),
      buffered_start_time: new Date(buffered_start_time),
      end_time: new Date(end_time),
      buffered_end_time: new Date(buffered_end_time),
      payment_required: payment_required ?? true,
    });

    const event = await eventService.createEvent({
      name,
      registration_required: registration_required ?? false,
      description,
      location,
      start_time: new Date(start_time),
      buffered_start_time: new Date(buffered_start_time),
      end_time: new Date(end_time),
      buffered_end_time: new Date(buffered_end_time),
      payment_required: payment_required ?? true,
      image_id: image_id ? Number(image_id) : undefined,
    });

    console.log("[API] Event created successfully:", event);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error: unknown) {
    console.error("[API] Error creating event:", error);
    if (error instanceof Error) {
      console.error("[API] Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Failed to create event",
      },
      { status: 500 },
    );
  }
}

