import { ApiResponse } from "@uwdsc/common/utils";
import { eventService as adminEventService } from "@uwdsc/admin";
import { eventService as coreEventService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { createEventSchema } from "@/lib/schemas/event";

/**
 * GET /api/events
 * Get all events
 * Authenticated endpoint
 */
export async function GET() {
  try {
    const { isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

    const events = await coreEventService.getAllEvents();
    return ApiResponse.ok(events);
  } catch (error: unknown) {
    console.error("Error fetching events:", error);
    return ApiResponse.serverError(error, "Failed to fetch events");
  }
}

/**
 * POST /api/events
 * Create a new event
 * Exec/admin only endpoint
 */
export async function POST(request: Request) {
  try {
    const { isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

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
}
