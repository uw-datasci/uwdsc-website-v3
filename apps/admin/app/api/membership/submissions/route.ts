import { RaftResponse } from "@uw-datasci/raft";
import { submissionReviewService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { createMembershipProofService } from "@/lib/services";
import type { SubmissionStatus } from "@uwdsc/common/types";

const VALID_STATUSES = new Set<SubmissionStatus>(["pending", "approved", "rejected"]);

/**
 * GET /api/membership/submissions
 * Online proof-of-payment review queue. Any exec / admin / pres.
 */
export const GET = withAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const termId = searchParams.get("termId") ?? undefined;

  const status =
    statusParam && VALID_STATUSES.has(statusParam as SubmissionStatus)
      ? (statusParam as SubmissionStatus)
      : undefined;

  const proofService = await createMembershipProofService();
  const submissions = await submissionReviewService.listSubmissions({ status, termId }, (key) =>
    proofService.getProofUrl(key)
  );

  return RaftResponse.ok({ submissions });
});
