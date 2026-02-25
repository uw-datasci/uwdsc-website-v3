import { ApiResponse } from "@uwdsc/common/utils";
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
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const events = activeOnly
      ? await coreEventService.getEventsByTimeRange({ range: "active" })
      : await coreEventService.getAllEvents();
    return ApiResponse.ok(events);
  } catch (error: unknown) {
    console.error("Error fetching events:", error);
    return ApiResponse.serverError(error, "Failed to fetch events");
  }
});

/**
 * POST /api/events
 * Create a new event
 * Admin/exec only
 */
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const validationResult = createEventSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(
        validationResult.error.issues[0]?.message || "Invalid data",
        "Validation error",
      );
    }

    const result = await adminEventService.createEvent(validationResult.data);

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Failed to create event");
    }
    return ApiResponse.ok({
      success: true,
      message: "Event created successfully",
      event: result.event,
    });
  } catch (error: unknown) {
    console.error("Error creating event:", error);
    return ApiResponse.serverError(error, "Failed to create event");
  }
});
