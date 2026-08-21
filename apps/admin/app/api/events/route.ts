import { RaftResponse } from "@uw-datasci/raft";
import { eventService as adminEventService } from "@uwdsc/admin";
import { eventService as coreEventService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";
import { createEventSchema } from "@/lib/schemas/event";

/**
 * GET /api/events
 * Get all events
 * Admin/exec only
 */
export const GET = withAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";
  const withAttendance = searchParams.get("withAttendance") === "true";

  const events = activeOnly
    ? await coreEventService.getEventsByTimeRange({ range: "active" })
    : withAttendance
      ? await coreEventService.getAllEventsWithAttendanceCount()
      : await coreEventService.getAllEvents();
  return RaftResponse.ok(events);
});

/**
 * POST /api/events
 * Create a new event
 * Admin/exec only
 */
export const POST = withAuth(async (request) => {
  const body = await request.json();
  const validationResult = createEventSchema.safeParse(body);

  if (!validationResult.success) {
    return RaftResponse.badRequest(
      validationResult.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );
  }

  const result = await adminEventService.createEvent(validationResult.data);

  if (!result.success) return RaftResponse.badRequest(result.error, "Failed to create event");

  return RaftResponse.ok({
    success: true,
    message: "Event created successfully",
    event: result.event,
  });
});
