import { RaftResponse } from "@uw-datasci/raft";
import { submissionReviewService } from "@uwdsc/admin";
import { withAuth, type WithAuthContext } from "@/guards/withAuth";
import { reviewSubmissionSchema } from "@/lib/schemas/membershipSubmission";
import { tryCheckInAtEvent } from "@/lib/server/tryCheckInAtEvent";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/membership/submissions/[id]/review
 * Approve or reject a submission. Rejection requires a reason.
 *
 * On approval, optionally checks the member into an active event as well —
 * same best-effort contract as the manual mark-as-paid route.
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

  const { event_id, ...decision } = parsed.data;

  const profileId = await submissionReviewService.review(id, user.id, decision);

  // Only an approval grants membership, so only an approval can check anyone in.
  // Best-effort: the decision is already committed, so a check-in failure is
  // reported rather than thrown.
  const checkIn =
    decision.decision === "approved" && event_id
      ? await tryCheckInAtEvent(event_id, profileId)
      : { checked_in: false };

  return RaftResponse.ok({
    success: true,
    message: decision.decision === "approved" ? "Submission approved" : "Submission rejected",
    ...checkIn,
  });
});
