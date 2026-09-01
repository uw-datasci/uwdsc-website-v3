import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { membershipSubmissionService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { createMembershipProofService } from "@/lib/services";

export const POST = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  // Check eligibility before reading the body: no point streaming 10 MB from
  // someone who is already verified or already has a submission in review.
  const { termCode } = await membershipSubmissionService.assertCanSubmit(user.id);

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) return RaftResponse.badRequest("No file provided");

  const proofService = await createMembershipProofService();
  const result = await proofService.uploadProof({ file, userId: user.id, termCode });

  if (!result.success) return RaftResponse.badRequest(result.error, "Upload failed");

  return RaftResponse.ok({
    key: result.key,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
  });
});
