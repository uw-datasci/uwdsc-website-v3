import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { eventService } from "@uwdsc/core";
import { buildICS } from "@/lib/utils/events";
import { recordFeedSubscriber } from "@/lib/utils/feedTracking";

/**
 * GET /api/events/feed
 * Returns an iCal feed of all events. Clients can subscribe to this URL
 * so their calendar app shows current and future events.
 *
 * Each request is recorded (fire-and-forget) to approximate subscriber counts
 * via IP deduplication. See lib/utils/feedTracking.ts.
 */
export const GET = withRaftRoute(async (request) => {
  const events = await eventService.getAllEvents();
  const ics = buildICS(events);
  // Fire-and-forget: never let tracking failure break the feed response
  void recordFeedSubscriber(request);
  return RaftResponse.text(ics, "text/calendar; charset=utf-8");
});
