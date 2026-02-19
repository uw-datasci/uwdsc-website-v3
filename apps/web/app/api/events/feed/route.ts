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
    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error generating events feed:", error);
    return new Response("Failed to generate calendar feed", { status: 500 });
  }
}
