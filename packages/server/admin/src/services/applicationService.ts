import {
  ApiError,
  type AppQuestion,
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
    const relationPositionId = await this.repository.getRelationPositionId(
      relationId,
    );
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
    const relationPositionId = await this.repository.getRelationPositionId(
      relationId,
    );
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
