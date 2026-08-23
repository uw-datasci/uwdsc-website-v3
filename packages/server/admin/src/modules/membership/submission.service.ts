import { ApiError } from "@uwdsc/common/types";
import type { ReviewSubmissionData, SubmissionReviewItem } from "@uwdsc/common/types";
import {
  SubmissionReviewRepository,
  type ListSubmissionsOptions,
} from "./submission.repository";

class SubmissionReviewService {
  private readonly repository: SubmissionReviewRepository;

  constructor() {
    this.repository = new SubmissionReviewRepository();
  }

  /**
   * The review queue. `resolveProofUrl` mints a signed URL per proof -- it is
   * injected because the Supabase client is request-scoped and so cannot live
   * on this singleton.
   */
  async listSubmissions(
    options: ListSubmissionsOptions,
    resolveProofUrl: (objectKey: string) => Promise<string | null>
  ): Promise<SubmissionReviewItem[]> {
    const rows = await this.repository.listSubmissions(options);
    const history = await this.repository.getReviewHistory(rows.map((r) => r.id));

    return Promise.all(
      rows.map(async ({ proof_object_key, ...row }) => ({
        ...row,
        proof_url: proof_object_key ? await resolveProofUrl(proof_object_key) : null,
        review_history: history.get(row.id) ?? [],
      }))
    );
  }

  async review(
    submissionId: string,
    reviewerId: string,
    data: ReviewSubmissionData
  ): Promise<void> {
    const submission = await this.repository.getSubmissionForReview(submissionId);
    if (!submission) throw new ApiError("Submission not found", 404);

    // `memberships_verifier_not_self` would otherwise turn this into a raw
    // Postgres error partway through the approval transaction.
    if (submission.profile_id === reviewerId) {
      throw new ApiError("You cannot review your own submission.", 403);
    }

    if (data.decision === "rejected") {
      const reason = data.reason?.trim();
      if (!reason) throw new ApiError("A reason is required to reject a submission.", 400);
      await this.repository.reject(submissionId, reviewerId, reason);
      return;
    }

    await this.repository.approve(submissionId, reviewerId);
  }
}

export const submissionReviewService = new SubmissionReviewService();
