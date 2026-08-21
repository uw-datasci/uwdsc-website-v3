import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { eventService } from "@uwdsc/core";

/**
 * GET /api/events
 * - No query: all events (public read for calendar).
 * - ?range=active: events currently in their buffered check-in window.
 * - ?range=next: next upcoming event (single or null).
 */
export const GET = withRaftRoute(async (request) => {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range");

  if (range === "active") {
    const events = await eventService.getEventsByTimeRange({ range: "active" });
    return RaftResponse.ok(events);
  }

  if (range === "next") {
    const events = await eventService.getEventsByTimeRange({
      range: "upcoming",
      limit: 1
    });
    return RaftResponse.ok(events[0] ?? null);
  }

  const events = await eventService.getAllEvents();
  return RaftResponse.ok(events);
});
