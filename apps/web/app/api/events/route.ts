import { ApiResponse } from "@uwdsc/common/utils";
import { eventService } from "@uwdsc/core";

/**
 * GET /api/events
 * Returns all events (public read for calendar).
 */
export async function GET() {
  try {
    const events = await eventService.getAllEvents();
    return ApiResponse.ok(events);
  } catch (error: unknown) {
    console.error("Error fetching events:", error);
    return ApiResponse.serverError(error, "Failed to fetch events");
  }
}
