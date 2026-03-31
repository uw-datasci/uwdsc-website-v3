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
  private readonly repository: ApplicationRepository;

  constructor() {
    this.repository = new ApplicationRepository();
  }

  /**
   * Get all submitted applications with full details (admin only)
   */
  async getAllApplications(): Promise<ApplicationListItem[]> {
    try {
      return await this.repository.getAllApplicationsWithDetails();
    } catch (error) {
      throw new ApiError(
        `Failed to get all applications: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getDraftAndSubmittedCounts(): Promise<{
    draft: number;
    submitted: number;
  }> {
    try {
      return await this.repository.countDraftAndSubmittedApplications();
    } catch (error) {
      throw new ApiError(
        `Failed to get application counts: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getApplicationsForScope(
    scope: QuestionScope,
  ): Promise<ApplicationListItem[]> {
    try {
      if (scope.isPresident) {
        return await this.repository.getAllApplicationsWithDetails();
      }
      return await this.repository.getApplicationsByPositionIdsWithDetails(
        scope.vpPositionIds,
      );
    } catch (error) {
      throw new ApiError(
        `Failed to get scoped applications: ${(error as Error).message}`,
        500,
      );
    }
  }

  async canAccessApplication(scope: QuestionScope, applicationId: string) {
    if (scope.isPresident) return true;
    return this.repository.canAccessApplicationByPositionIds(
      applicationId,
      scope.vpPositionIds,
    );
  }

  async updateApplicationReviewStatus(
    scope: QuestionScope,
    applicationId: string,
    status: ApplicationReviewStatus,
  ) {
    const canAccess = await this.canAccessApplication(scope, applicationId);
    if (!canAccess) {
      throw new ApiError("You do not have access to this application", 403);
    }

    try {
      const updated = await this.repository.updateApplicationReviewStatus(
        applicationId,
        status,
      );
      if (!updated) throw new ApiError("Application not found", 404);
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to update application review status: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getQuestionsForScope(scope: QuestionScope): Promise<AppQuestion[]> {
    const allQuestions = await this.repository.getAllQuestions();
    if (scope.isPresident) {
      return allQuestions.map((q) => ({ ...q, can_edit: true }));
    }

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

  canAccessPosition(scope: QuestionScope, positionId: number | null): boolean {
    if (scope.isPresident) return true;
    if (positionId === null) return false;
    return scope.vpPositionIds.includes(positionId);
  }

  canAccessRelation(
    scope: QuestionScope,
    relationPositionId: number | null,
  ): boolean {
    return this.canAccessPosition(scope, relationPositionId);
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
    relationId: number,
    data: QuestionUpsertInput,
  ): Promise<AppQuestion | null> {
    const relationPositionId =
      await this.repository.getRelationPositionId(relationId);
    if (
      relationPositionId === null ||
      !this.canAccessRelation(scope, relationPositionId)
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
      return await this.repository.updateQuestion(relationId, data);
    } catch (error) {
      throw new ApiError(
        `Failed to update application question: ${(error as Error).message}`,
        500,
      );
    }
  }

  async deleteQuestion(
    scope: QuestionScope,
    relationId: number,
  ): Promise<boolean> {
    const relationPositionId =
      await this.repository.getRelationPositionId(relationId);
    if (
      relationPositionId === null ||
      !this.canAccessRelation(scope, relationPositionId)
    ) {
      throw new ApiError("You do not have access to this question", 403);
    }

    try {
      return await this.repository.deleteQuestion(relationId);
    } catch (error) {
      throw new ApiError(
        `Failed to delete application question: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const applicationService = new ApplicationService();
