import { RaftResponse } from "@uw-datasci/raft";
import type { UpdateMemberData } from "@uwdsc/common/types";
import { membershipService, profileService } from "@uwdsc/admin";
import { inviteMemberSchema, type InviteMemberFormValues } from "@/lib/schemas/membership";
import { withAuth } from "@/guards/withAuth";

function invitePayloadToProfileUpdate(
  body: InviteMemberFormValues
): UpdateMemberData | undefined {
  const u: UpdateMemberData = {};
  if (body.first_name) u.first_name = body.first_name;
  if (body.last_name) u.last_name = body.last_name;
  if (body.wat_iam) u.wat_iam = body.wat_iam;
  if (body.faculty) u.faculty = body.faculty;
  if (body.term) u.term = body.term;
  if (body.is_math_soc_member !== undefined) u.is_math_soc_member = body.is_math_soc_member;

  return Object.keys(u).length > 0 ? u : undefined;
}

/**
 * GET /api/members
 * Get all user profiles with membership statistics
 * Admin/exec only
 */
export const GET = withAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const statsOnly = searchParams.get("stats") === "true";
  const paidOnly = searchParams.get("paid") === "true";
  const searchQuery = searchParams.get("search") || undefined;

  if (statsOnly) {
    const stats = await membershipService.getMembershipStats();
    return RaftResponse.ok({ stats });
  }

  const profiles = await profileService.getAllProfiles({ paidOnly, searchQuery });
  return RaftResponse.ok(profiles);
});

/**
 * POST /api/members
 * Invite a new member by email (Supabase admin invite).
 * Admin/exec only
 */
export const POST = withAuth(async (request) => {
  const body = await request.json();
  const validationResult = inviteMemberSchema.safeParse(body);

  if (!validationResult.success) {
    return RaftResponse.badRequest(
      validationResult.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );
  }

  const parsed = validationResult.data;
  const profile = invitePayloadToProfileUpdate(parsed);

  const result = await profileService.inviteMemberByEmail({ email: parsed.email, profile });

  if (!result.success) {
    return result.error === "A member with this email already exists"
      ? RaftResponse.json({ error: "Conflict", message: result.error }, 409)
      : RaftResponse.badRequest(result.error, "Invite failed");
  }

  return RaftResponse.ok({ success: true, userId: result.userId, message: "Invitation sent" });
});
