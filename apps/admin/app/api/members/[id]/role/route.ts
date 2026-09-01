import { RaftResponse } from "@uw-datasci/raft";
import { updateMemberRoleSchema } from "@/lib/schemas/membership";
import { profileService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";
import type { WithAuthContext } from "@/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/members/[id]/role
 * Update a member's role and subteam. President-only.
 */
export const PATCH = withPresAccess<Params>(async (request, { params }) => {
  const body = await request.json();
  const { id } = await params;
  const validationResult = updateMemberRoleSchema.safeParse(body);

  if (!validationResult.success) {
    return RaftResponse.badRequest(
      validationResult.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );
  }

  const result = await profileService.updateMemberRole(
    id,
    validationResult.data.role,
    validationResult.data.subteam_id
  );

  if (!result.success) return RaftResponse.badRequest(result.error, "Failed to update role");

  return RaftResponse.ok({ success: true, message: "Member role updated successfully" });
});
