import {
  ApiError,
  type AppQuestion,
  type ApplicationReviewStatus,
  type ApplicationListItem,
  type QuestionPositionOption,
  type QuestionScope,
  type QuestionUpsertInput,
} from "@uwdsc/common/types";
import { ApplicationRepository } from "../repositories/applicationRepository";

class ApplicationService {
  private readonly VP_REVIEW_STATUS_SET = new Set<ApplicationReviewStatus>([
    "In Review",
    "Interviewing",
    "Wanted",
    "Not Wanted",
  ]);

  private readonly PRESIDENT_REVIEW_STATUS_SET =
    new Set<ApplicationReviewStatus>([
      ...this.VP_REVIEW_STATUS_SET,
      "Offer Sent",
      "Accepted Offer",
      "Declined Offer",
      "Rejection Sent",
    ]);
  private readonly repository: ApplicationRepository;

  constructor() {
    this.repository = new ApplicationRepository();
  }

  private canAccessPosition(
    scope: QuestionScope,
    positionId: number | null,
  ): boolean {
    if (scope.isPresident) return true;
    if (positionId === null) return false;
    return scope.vpPositionIds.includes(positionId);
  }

  /**
   * Get all submitted applications with full details (admin only)
   */
  async getAllApplications(): Promise<ApplicationListItem[]> {
    try {
      return await this.repository.getAllApplicationsDetails();
    } catch (error) {
      throw new ApiError(
        `Failed to get all applications: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getApplicationCounts(): Promise<{
    draft: number;
    submitted: number;
  }> {
    try {
      return await this.repository.countApplications();
    } catch (error) {
      throw new ApiError(
        `Failed to get application counts: ${(error as Error).message}`,
        500,
      );
    }
  }

  private async canAccessApplication(
    scope: QuestionScope,
    applicationId: string,
  ) {
    if (scope.isPresident) return true;
    return this.repository.canAccessApplicationByPositionIds(
      applicationId,
      scope.vpPositionIds,
    );
  }

  async updatePositionSelectionReviewStatus(
    scope: QuestionScope,
    selectionId: string,
    status: ApplicationReviewStatus,
  ): Promise<void> {
    const row = await this.repository.getPositionSelectionRow(selectionId);
    if (!row) {
      throw new ApiError("Position selection not found", 404);
    }

    const canAccess = await this.canAccessApplication(
      scope,
      row.application_id,
    );
    if (!canAccess)
      throw new ApiError("You do not have access to this application", 403);

    const allowedStatuses = scope.isPresident
      ? this.PRESIDENT_REVIEW_STATUS_SET
      : this.VP_REVIEW_STATUS_SET;

    if (!allowedStatuses.has(status)) throw new ApiError("Invalid status", 400);

    if (!scope.isPresident && !scope.vpPositionIds.includes(row.position_id)) {
      throw new ApiError("You cannot update this position", 403);
    }

    if (!this.VP_REVIEW_STATUS_SET.has(row.status)) {
      throw new ApiError(
        "This selection is past VP review; update it from Hiring instead",
        400,
      );
    }

    try {
      const updated = await this.repository.updatePositionSelectionStatus(
        selectionId,
        status,
      );
      if (!updated) throw new ApiError("Position selection not found", 404);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to update position review status: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getQuestionsForScope(scope: QuestionScope): Promise<AppQuestion[]> {
    const allQuestions = await this.repository.getAllQuestions();
    if (scope.isPresident)
      return allQuestions.map((q) => ({ ...q, can_edit: true }));

    return allQuestions.map((q) => ({
      ...q,
      can_edit:
        q.position_id !== null && scope.vpPositionIds.includes(q.position_id),
    }));
  }

  async getPositionOptionsForScope(
    scope: QuestionScope,
  ): Promise<QuestionPositionOption[]> {
    return this.repository.getPositionOptions(scope);
  }

  async createQuestion(
    scope: QuestionScope,
    data: QuestionUpsertInput,
  ): Promise<AppQuestion> {
    if (!this.canAccessPosition(scope, data.position_id)) {
      throw new ApiError(
        "You can only create questions for your VP position scope",
        403,
      );
    }
    try {
      return await this.repository.createQuestion(data);
    } catch (error) {
      throw new ApiError(
        `Failed to create application question: ${(error as Error).message}`,
        500,
      );
    }
  }

  async updateQuestion(
    scope: QuestionScope,
    positionQuestionId: number,
    data: QuestionUpsertInput,
  ): Promise<AppQuestion | null> {
    const linkedPositionId =
      await this.repository.getPositionQuestionPositionId(positionQuestionId);
    if (
      linkedPositionId === null ||
      !this.canAccessPosition(scope, linkedPositionId)
    ) {
      throw new ApiError("You do not have access to this question", 403);
    }

    if (!this.canAccessPosition(scope, data.position_id)) {
      throw new ApiError(
        "You can only assign questions to your VP position scope",
        403,
      );
    }

    try {
      return await this.repository.updateQuestion(positionQuestionId, data);
    } catch (error) {
      throw new ApiError(
        `Failed to update application question: ${(error as Error).message}`,
        500,
      );
    }
  }

  async deleteQuestion(
    scope: QuestionScope,
    positionQuestionId: number,
  ): Promise<boolean> {
    const linkedPositionId =
      await this.repository.getPositionQuestionPositionId(positionQuestionId);
    if (
      linkedPositionId === null ||
      !this.canAccessPosition(scope, linkedPositionId)
    ) {
      throw new ApiError("You do not have access to this question", 403);
    }

    try {
      return await this.repository.deleteQuestion(positionQuestionId);
    } catch (error) {
      throw new ApiError(
        `Failed to delete application question: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const applicationService = new ApplicationService();
