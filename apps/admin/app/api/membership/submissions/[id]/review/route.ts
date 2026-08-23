import { RaftResponse } from "@uw-datasci/raft";
import { submissionReviewService } from "@uwdsc/admin";
import { withAuth, type WithAuthContext } from "@/guards/withAuth";
import { reviewSubmissionSchema } from "@/lib/schemas/membershipSubmission";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/membership/submissions/[id]/review
 * Approve or reject a submission. Rejection requires a reason.
 */
export const POST = withAuth<Params>(async (request, { params }, user) => {
  const { id } = await params;
  const body = await request.json();

  const parsed = reviewSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid data",
      "Validation error"
    );
  }

  await submissionReviewService.review(id, user.id, parsed.data);

  return RaftResponse.ok({
    success: true,
    message:
      parsed.data.decision === "approved" ? "Submission approved" : "Submission rejected",
  });
});
