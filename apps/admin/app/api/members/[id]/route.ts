import { RaftResponse } from "@uw-datasci/raft";
import { markAsPaidSchema, editMemberSchema } from "@/lib/schemas/membership";
import { membershipService, profileService } from "@uwdsc/admin";
import { eventService as coreEventService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";
import { withAdmin } from "@/guards/withAdmin";
import type { WithAuthContext } from "@/guards/withAuth";

// TODO: place in utils/service
/**
 * Best-effort check-in performed alongside marking a member as paid.
 * Marking paid is the critical action, so a failure here never fails the
 * request — it is surfaced to the UI via `check_in_error` instead.
 * Re-validates the active window server-side (the client-fetched active event
 * may have lapsed between page load and submit).
 */
async function tryCheckInAtEvent(
  eventId: string,
  profileId: string
): Promise<{ checked_in: boolean; check_in_error?: string }> {
  try {
    const event = await coreEventService.getEventById(eventId);
    if (!event) return { checked_in: false, check_in_error: "Event not found." };

    const now = new Date();
    const bufferedStart = new Date(event.buffered_start_time);
    const bufferedEnd = new Date(event.buffered_end_time);
    if (now < bufferedStart || now > bufferedEnd) {
      return { checked_in: false, check_in_error: "Check-in no longer open" };
    }

    const inserted = await coreEventService.checkInUser(eventId, profileId);
    if (inserted) return { checked_in: true };

    // No row inserted: either already checked in (treat as success) or a
    // transient conflict. Confirm via attendance lookup.
    const alreadyIn = await coreEventService.getAttendanceForUser(eventId, profileId);
    return alreadyIn
      ? { checked_in: true }
      : { checked_in: false, check_in_error: "Could not check" };
  } catch (error) {
    console.error("Error checking member in during mark-as-paid:", error);
    return { checked_in: false, check_in_error: "Could not check the member in." };
  }
}

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/members/[id]
 * Update member information or mark as paid
 * Admin/exec only
 */
export const PATCH = withAuth<Params>(async (request, { params }) => {
  const body = await request.json();
  const { id } = await params;

  // Determine operation type based on payload
  const isMarkAsPaid = "payment_method" in body;

  if (isMarkAsPaid) {
    // Validate mark as paid data
    const validationResult = markAsPaidSchema.safeParse(body);

    if (!validationResult.success) {
      return RaftResponse.badRequest(
        validationResult.error.issues[0]?.message || "Invalid data",
        "Validation error"
      );
    }

    const { event_id, ...paymentData } = validationResult.data;
    const result = await membershipService.markMemberAsPaid(id, paymentData);
    if (!result.success) return RaftResponse.badRequest(result.error, "Failed to mark as paid");

    // Optionally check the member into the active event. Best-effort: paid is
    // already committed, so a check-in failure is reported, not thrown.
    const checkIn = event_id ? await tryCheckInAtEvent(event_id, id) : { checked_in: false };

    return RaftResponse.ok({ success: true, message: "Member marked as paid", ...checkIn });
  }

  // Validate edit member data
  const validationResult = editMemberSchema.safeParse(body);

  if (!validationResult.success) {
    return RaftResponse.badRequest(
      validationResult.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );
  }

  const result = await profileService.updateMember(id, validationResult.data);
  if (!result.success) return RaftResponse.badRequest(result.error, "Failed to update member");

  return RaftResponse.ok({ success: true, message: "Member updated successfully" });
});

/**
 * DELETE /api/members/[id]
 * Delete a member
 * Admin/president only
 */
export const DELETE = withAdmin<Params>(async (_request, { params }) => {
  const { id } = await params;
  const result = await profileService.deleteMember(id);
  if (!result.success) return RaftResponse.badRequest(result.error, "Failed to delete member");

  return RaftResponse.ok({ success: true, message: "Member deleted successfully" });
});
