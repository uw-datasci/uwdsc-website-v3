import { ApiResponse } from "@uwdsc/common/utils";
import { checkinService } from "@uwdsc/admin";
import { eventService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";

/**
 * POST /api/checkin/manual
 * Check in the user manually bypassing TOTP token.
 * Body: { event_id, profile_id }
 */
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const { event_id, profile_id } = body;

    if (!event_id || !profile_id) {
      return ApiResponse.badRequest("event_id and profile_id are required");
    }

    const event = await eventService.getEventById(event_id);
    if (!event) return ApiResponse.badRequest("Event not found");

    const result = await checkinService.manualCheckIn(event, profile_id);

    if (!result.success) {
      return ApiResponse.badRequest(result.error ?? "Manual check-in failed");
    }

    return ApiResponse.ok({
      success: true,
      profile: result.profile,
    });
  } catch (error: unknown) {
    console.error("Error during manual check-in:", error);
    return ApiResponse.serverError(error, "Manual check-in failed");
  }
});
