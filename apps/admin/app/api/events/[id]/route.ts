import { RaftResponse } from "@uw-datasci/raft";
import { eventService as adminEventService } from "@uwdsc/admin";
import { eventService as coreEventService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";
import { updateEventSchema } from "@/lib/schemas/event";
import type { WithAuthContext } from "@/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/events/[id]
 * Get a single event by ID
 * Admin/exec only
 */
export const GET = withAuth<Params>(async (_request, { params }) => {
  const { id } = await params;
  const event = await coreEventService.getEventById(id);
  if (!event) return RaftResponse.notFound("Event not found");

  return RaftResponse.ok(event);
});

/**
 * PATCH /api/events/[id]
 * Update an event (partial update)
 * Admin/exec only
 */
export const PATCH = withAuth<Params>(async (request, { params }) => {
  const body = await request.json();
  const { id } = await params;
  const validationResult = updateEventSchema.safeParse(body);

  if (!validationResult.success) {
    return RaftResponse.badRequest(
      validationResult.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );
  }

  const result = await adminEventService.updateEvent(id, validationResult.data);

  if (!result.success) return RaftResponse.badRequest(result.error, "Failed to update event");

  return RaftResponse.ok({ success: true, message: "Event updated successfully" });
});

/**
 * DELETE /api/events/[id]
 * Delete an event
 * Admin/exec only
 */
export const DELETE = withAuth<Params>(async (_request, { params }) => {
  const { id } = await params;
  const result = await adminEventService.deleteEvent(id);
  if (!result.success) return RaftResponse.badRequest(result.error, "Failed to delete event");

  return RaftResponse.ok({ success: true, message: "Event deleted successfully" });
});
