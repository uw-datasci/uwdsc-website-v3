import { RaftResponse } from "@uw-datasci/raft";
import { eventService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/events/subscribers
 * Returns the count of unique calendar feed subscribers (distinct hashed IPs)
 * seen in the last 30 days.
 * Admin/exec only.
 */
export const GET = withAuth(async () => {
  const count = await eventService.getFeedSubscriberCount(30);
  return RaftResponse.ok({ count });
});
