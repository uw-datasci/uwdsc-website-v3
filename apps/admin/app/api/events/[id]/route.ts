import { ApiResponse } from "@uwdsc/common/utils";
import { eventService as adminEventService } from "@uwdsc/admin";
import { eventService as coreEventService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { updateEventSchema } from "@/lib/schemas/event";
import { NextRequest } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/events/[id]
 * Get a single event by ID
 * Authenticated endpoint
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

    const { id } = await params;
    const event = await coreEventService.getEventById(id);

    if (!event) return ApiResponse.badRequest("Event not found", "Not found");

    return ApiResponse.ok(event);
  } catch (error: unknown) {
    console.error("Error fetching event:", error);
    return ApiResponse.serverError(error, "Failed to fetch event");
  }
}

/**
 * PATCH /api/events/[id]
 * Update an event (partial update)
 * Exec/admin only endpoint
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

    const body = await request.json();
    const { id } = await params;

    const validationResult = updateEventSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(
        validationResult.error.issues[0]?.message || "Invalid data",
        "Validation error",
      );
    }

    const result = await adminEventService.updateEvent(
      id,
      validationResult.data,
    );

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Failed to update event");
    }

    return ApiResponse.ok({
      success: true,
      message: "Event updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating event:", error);
    return ApiResponse.serverError(error, "Failed to update event");
  }
}

/**
 * DELETE /api/events/[id]
 * Delete an event
 * Admin only endpoint
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized) return isUnauthorized;

    const { id } = await params;
    const result = await adminEventService.deleteEvent(id);

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Failed to delete event");
    }

    return ApiResponse.ok({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    return ApiResponse.serverError(error, "Failed to delete event");
  }
}
