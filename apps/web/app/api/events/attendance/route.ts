import { NextRequest } from "next/server";
import { ApiResponse } from "@uwdsc/common/utils";
import { eventService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";

/**
 * GET /api/events/attendance?event_id=<UUID>
 * Checks if the current user has an attendance record for the given event.
 */
export async function GET(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const eventId = request.nextUrl.searchParams.get("event_id");
    if (!eventId) {
      return ApiResponse.badRequest("event_id query parameter is required");
    }

    const checkedIn = await eventService.getAttendanceForUser(
      eventId,
      user.id,
    );

    return ApiResponse.ok({ checked_in: checkedIn });
  } catch (error: unknown) {
    console.error("Error checking attendance:", error);
    return ApiResponse.serverError(error, "Failed to check attendance");
  }
}
