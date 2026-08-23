import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { membershipSubmissionService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { createMembershipProofService } from "@/lib/services";
import { membershipSubmissionApiSchema } from "@/lib/schemas/membershipSubmission";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const proofService = await createMembershipProofService();
  const view = await membershipSubmissionService.getCurrentView(user.id, (key) =>
    proofService.getProofUrl(key)
  );

  return RaftResponse.ok(view);
});

export const POST = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const body = await request.json();
  const parsed = membershipSubmissionApiSchema.safeParse(body);

  if (!parsed.success) {
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid data",
      "Validation error"
    );
  }

  const view = await membershipSubmissionService.submit(user.id, parsed.data);

  return RaftResponse.ok(view);
});
