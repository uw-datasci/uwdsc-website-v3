import { ApiResponse } from "@uwdsc/common/utils";
import { updateMemberRoleSchema } from "@/lib/schemas/membership";
import { profileService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";
import type { WithAuthContext } from "@/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/members/[id]/role
 * Update a member's role. President-only.
 */
export const PATCH = withPresAccess<Params>(async (request, { params }) => {
  try {
    const body = await request.json();
    const { id } = await params;

    const validationResult = updateMemberRoleSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(
        validationResult.error.issues[0]?.message || "Invalid data",
        "Validation error",
      );
    }

    const result = await profileService.updateMemberRole(
      id,
      validationResult.data.role,
    );

    if (!result.success) {
      return ApiResponse.badRequest(
        result.error,
        "Failed to update member role",
      );
    }

    return ApiResponse.ok({
      success: true,
      message: "Member role updated successfully",
    });
  } catch (error) {
    console.error("Error updating member role:", error);
    return ApiResponse.serverError(error, "Failed to update member role");
  }
});
