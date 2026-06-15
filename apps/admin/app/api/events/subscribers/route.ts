import { ApiResponse } from "@uwdsc/common/utils";
import { eventService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/events/subscribers
 * Returns the count of unique calendar feed subscribers (distinct hashed IPs)
 * seen in the last 30 days.
 * Admin/exec only.
 */
export const GET = withAuth(async () => {
  try {
    const count = await eventService.getFeedSubscriberCount(30);
    return ApiResponse.ok({ count });
  } catch (error: unknown) {
    console.error("Error fetching feed subscriber count:", error);
    return ApiResponse.serverError(error, "Failed to fetch feed subscriber count");
  }
});
