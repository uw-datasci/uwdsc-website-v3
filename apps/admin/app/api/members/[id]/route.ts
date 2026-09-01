import { RaftResponse } from "@uw-datasci/raft";
import { markAsPaidSchema, editMemberSchema } from "@/lib/schemas/membership";
import { membershipService, profileService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { withAdmin } from "@/guards/withAdmin";
import { tryCheckInAtEvent } from "@/lib/server/tryCheckInAtEvent";
import type { WithAuthContext } from "@/guards/withAuth";

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
