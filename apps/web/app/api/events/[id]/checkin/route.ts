import { ApiResponse } from "@uwdsc/common/utils";
import { eventService, membershipService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id } = await params;

    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const checkedIn = await eventService.getAttendanceForUser(id, user.id);
    return ApiResponse.ok({ checkedIn });
  } catch (error: unknown) {
    console.error("Error checking attendance:", error);
    return ApiResponse.serverError(error, "Failed to check attendance");
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id } = await params;

    // 1. Check auth
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    // 2. Check if user has membership
    const { has_membership } = await membershipService.getMembershipStatus(user.id);
    if (!has_membership) {
      return ApiResponse.badRequest("You must have an active membership to check in.");
    }

    // 3. Check if event is active (valid time window)
    const event = await eventService.getEventById(id);
    if (!event) {
      return ApiResponse.notFound("Event not found");
    }

    const now = new Date();
    const bufferedStart = new Date(event.buffered_start_time);
    const bufferedEnd = new Date(event.buffered_end_time);

    if (now < bufferedStart || now > bufferedEnd) {
      return ApiResponse.badRequest("Check-in is not currently open for this event.");
    }

    // 4. Check in the user. checkInUser inserts with ON CONFLICT DO NOTHING
    // and reports whether a row was actually created, so a repeat check-in
    // is a clean "no new stamp" rather than a silent duplicate success.
    const stampAwarded = await eventService.checkInUser(id, user.id);

    return ApiResponse.ok({
      message: stampAwarded ? "Successfully checked in" : "Already checked in",
      success: true,
      stampAwarded,
    });
  } catch (error: unknown) {
    console.error("Error during check-in:", error);
    return ApiResponse.serverError(error, "Failed to check in");
  }
}
