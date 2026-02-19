import { cacheLife } from "next/cache";
import { eventService } from "@uwdsc/core";
import { buildICS } from "@/lib/utils/events";

/** Build ICS feed; cached remotely so many calendar clients don't each hit the DB. */
async function getCachedFeed(): Promise<string> {
  "use cache: remote";
  cacheLife({ revalidate: 3600 }); // 1 hour

  const events = await eventService.getAllEvents();
  return buildICS(events);
}

/**
 * GET /api/events/feed
 * Returns an iCal feed of all events. Clients can subscribe to this URL
 * so their calendar app shows current and future events.
 *
 * Caching:
 * - Runtime: use cache: remote (shared across serverless instances, 1 hour revalidate).
 * - CDN: Cache-Control + CDN-Cache-Control so edge caches full responses.
 */
export async function GET() {
  try {
    const ics = await getCachedFeed();
    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "CDN-Cache-Control": "public, max-age=3600, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error generating events feed:", error);
    return new Response("Failed to generate calendar feed", { status: 500 });
  }
}
