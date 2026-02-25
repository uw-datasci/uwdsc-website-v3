import { ApiResponse } from "@uwdsc/common/utils";
import { eventService } from "@uwdsc/core";

/**
 * GET /api/events
 * - No query: all events (public read for calendar).
 * - ?range=active: events currently in their buffered check-in window.
 * - ?range=next: next upcoming event (single or null).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range");

    if (range === "active") {
      const events = await eventService.getEventsByTimeRange({ range: "active" });
      return ApiResponse.ok(events);
    }

    if (range === "next") {
      const events = await eventService.getEventsByTimeRange({
        range: "upcoming",
        limit: 1,
      });
      return ApiResponse.ok(events[0] ?? null);
    }

    const events = await eventService.getAllEvents();
    return ApiResponse.ok(events);
  } catch (error: unknown) {
    console.error("Error fetching events:", error);
    return ApiResponse.serverError(error, "Failed to fetch events");
  }
}
