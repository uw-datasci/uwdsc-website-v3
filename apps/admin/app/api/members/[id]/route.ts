import { ApiResponse } from "@uwdsc/common/utils";
import { markAsPaidSchema, editMemberSchema } from "@/lib/schemas/membership";
import { profileService } from "@uwdsc/admin";
import { withAuth } from "@/lib/guards/withAuth";
import type { WithAuthContext } from "@/lib/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/members/[id]
 * Update member information or mark as paid
 * Admin/exec only
 */
export const PATCH = withAuth<Params>(async (request, { params }) => {
  try {
    const body = await request.json();
    const { id } = await params;

    // Determine operation type based on payload
    const isMarkAsPaid = "payment_method" in body;

    if (isMarkAsPaid) {
      // Validate mark as paid data
      const validationResult = markAsPaidSchema.safeParse(body);

      if (!validationResult.success) {
        return ApiResponse.badRequest(
          validationResult.error.issues[0]?.message || "Invalid data",
          "Validation error",
        );
      }

      const result = await profileService.markMemberAsPaid(
        id,
        validationResult.data,
      );

      if (!result.success) {
        return ApiResponse.badRequest(result.error, "Failed to mark as paid");
      }

      return ApiResponse.ok({
        success: true,
        message: "Member marked as paid",
      });
    }

    // Validate edit member data
    const validationResult = editMemberSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(
        validationResult.error.issues[0]?.message || "Invalid data",
        "Validation error",
      );
    }

    const result = await profileService.updateMember(id, validationResult.data);

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Failed to update member");
    }

    return ApiResponse.ok({
      success: true,
      message: "Member updated successfully",
    });
  } catch (error) {
    console.error("Error updating member:", error);
    return ApiResponse.serverError(error, "Failed to update member");
  }
});

/**
 * DELETE /api/members/[id]
 * Delete a member
 * Admin/exec only
 */
export const DELETE = withAuth<Params>(async (_request, { params }) => {
  try {
    const { id } = await params;

    const result = await profileService.deleteMember(id);

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Failed to delete member");
    }

    return ApiResponse.ok({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    return ApiResponse.serverError(error, "Failed to delete member");
  }
});
