import {
  ApiError,
  type ApplicationReviewStatus,
  type QuestionScope,
  type ReturningExecListItem,
  type ReturningExecOwnSubmission,
  type ReturningExecSubmissionData,
} from "@uwdsc/common/types";
import { ReturningExecRepository } from "../repositories/returningExecRepository";

const VP_REVIEW_STATUS_SET = new Set<ApplicationReviewStatus>([
  "In Review",
  "Interviewing",
  "Wanted",
  "Not Wanted",
]);

const PRESIDENT_REVIEW_STATUS_SET = new Set<ApplicationReviewStatus>([
  ...VP_REVIEW_STATUS_SET,
  "Offer Sent",
  "Accepted Offer",
  "Declined Offer",
  "Rejection Sent",
]);

class ReturningExecService {
  private readonly repository: ReturningExecRepository;

  constructor() {
    this.repository = new ReturningExecRepository();
  }

  async getOwnSubmission(
    profile_id: string,
  ): Promise<ReturningExecOwnSubmission | null> {
    const term = await this.repository.getActiveTerm();
    if (!term) return null;
    return this.repository.getSubmission(profile_id, term.id);
  }

  async upsertSubmission(
    profile_id: string,
    data: ReturningExecSubmissionData,
  ): Promise<ReturningExecOwnSubmission> {
    const term = await this.repository.getActiveTerm();
    if (!term) {
      throw new ApiError("No active term found", 400);
    }

    if (data.position_selections.length > 3) {
      throw new ApiError("Cannot select more than 3 positions", 400);
    }

    const priorities = data.position_selections.map((s) => s.priority);
    const uniquePriorities = new Set(priorities);
    if (uniquePriorities.size !== priorities.length) {
      throw new ApiError("Duplicate priorities in position selections", 400);
    }

    return this.repository.upsertSubmission(profile_id, {
      ...data,
      term_id: term.id,
    });
  }

  async getAllSubmissionsForActiveTerm(): Promise<{
    submissions: ReturningExecListItem[];
    termId: string | null;
  }> {
    const term = await this.repository.getActiveTerm();
    if (!term) return { submissions: [], termId: null };
    try {
      const submissions = await this.repository.getAllSubmissions(term.id);
      return { submissions, termId: term.id };
    } catch (error) {
      throw new ApiError(
        `Failed to get returning exec submissions: ${(error as Error).message}`,
        500,
      );
    }
  }

  async updateSelectionReviewStatus(
    scope: QuestionScope,
    selectionId: string,
    status: ApplicationReviewStatus,
  ): Promise<void> {
    const selection = await this.repository.getSelectionById(selectionId);
    if (!selection) {
      throw new ApiError("Selection not found", 404);
    }

    const allowedStatuses = scope.isPresident
      ? PRESIDENT_REVIEW_STATUS_SET
      : VP_REVIEW_STATUS_SET;

    if (!allowedStatuses.has(status)) {
      throw new ApiError(
        `Status "${status}" is not allowed for your role`,
        403,
      );
    }

    if (!scope.isPresident) {
      const allowed = scope.vpPositionIds.includes(selection.position_id);
      if (!allowed) {
        throw new ApiError(
          "You can only update selections for positions in your subteam",
          403,
        );
      }
    }

    await this.repository.updateSelectionStatus(selectionId, status);
  }
}

export const returningExecService = new ReturningExecService();
