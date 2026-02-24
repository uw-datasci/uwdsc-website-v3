import { ApiResponse } from "@uwdsc/common/utils";
import { checkinService } from "@uwdsc/admin";
import { eventService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";

/**
 * POST /api/checkin
 * Validate QR data and check in the user.
 * Body: { event_id, membership_id, token }
 */
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const { event_id, membership_id, token } = body;

    if (!event_id || !membership_id || !token) {
      return ApiResponse.badRequest(
        "event_id, membership_id, and token are required",
      );
    }

    const event = await eventService.getEventById(event_id);
    if (!event) return ApiResponse.badRequest("Event not found");

    const result = await checkinService.validateAndCheckIn(
      event,
      membership_id,
      token,
    );

    if (!result.success) {
      return ApiResponse.badRequest(result.error ?? "Check-in failed");
    }

    return ApiResponse.ok({ success: true, profile: result.profile });
  } catch (error: unknown) {
    console.error("Error during check-in:", error);
    return ApiResponse.serverError(error, "Check-in failed");
  }
});

/**
 * DELETE /api/checkin
 * Un-check-in a user.
 * Body: { event_id, profile_id }
 */
export const DELETE = withAuth(async (request) => {
  try {
    const body = await request.json();
    const { event_id, profile_id } = body;

    if (!event_id || !profile_id) {
      return ApiResponse.badRequest("event_id and profile_id are required");
    }

    const deleted = await checkinService.uncheckIn(event_id, profile_id);

    if (!deleted) {
      return ApiResponse.badRequest("No attendance record found to remove");
    }

    return ApiResponse.ok({ success: true });
  } catch (error: unknown) {
    console.error("Error during uncheck-in:", error);
    return ApiResponse.serverError(error, "Uncheck-in failed");
  }
});
