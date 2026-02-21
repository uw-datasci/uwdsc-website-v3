import { ApiResponse } from "@uwdsc/common/utils";
import { eventService } from "@uwdsc/core";
import { buildICS } from "@/lib/utils/events";

/**
 * GET /api/events/feed
 * Returns an iCal feed of all events. Clients can subscribe to this URL
 * so their calendar app shows current and future events.
 */
export async function GET() {
  try {
    const events = await eventService.getAllEvents();
    const ics = buildICS(events);
    return ApiResponse.text(ics, "text/calendar; charset=utf-8");
  } catch (error) {
    console.error("Error generating events feed:", error);
    return ApiResponse.serverError(error, "Failed to generate calendar feed");
  }
}
