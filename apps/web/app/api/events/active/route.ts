import { ApiResponse } from "@uwdsc/common/utils";
import { eventService } from "@uwdsc/core";

/**
 * GET /api/events/active
 * Returns events currently within their buffered check-in window.
 */
export async function GET() {
  try {
    const activeEvents = await eventService.getActiveEvents();
    const nextEvent = await eventService.getNextUpcomingEvent();
    return ApiResponse.ok({ activeEvents, nextEvent });
  } catch (error: unknown) {
    console.error("Error fetching active events:", error);
    return ApiResponse.serverError(error, "Failed to fetch active events");
  }
}
