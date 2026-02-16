import {
  ApiError,
  ApplicationUpdatePayload,
  ApplicationWithDetails,
  GeneralQuestion,
  PositionWithQuestions,
  ProfileAutofill,
  Term,
} from "@uwdsc/common/types";
import { ApplicationRepository } from "../repositories/applicationRepository";

class ApplicationService {
  private readonly repository: ApplicationRepository;

  constructor() {
    this.repository = new ApplicationRepository();
  }

  async getActiveTerm(): Promise<Term | null> {
    try {
      return await this.repository.getActiveTerm();
    } catch (error) {
      throw new ApiError(
        `Failed to get active term: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getPositionsWithQuestions(): Promise<{
    generalQuestions: GeneralQuestion[];
    positions: PositionWithQuestions[];
  }> {
    try {
      const [positionRows, questionRows] = await Promise.all([
        this.repository.getAvailablePositions(),
        this.repository.getQuestionsForPositions(),
      ]);

      const generalQuestions = questionRows
        .filter((q) => q.position_id === null)
        .map((q) => ({
          id: q.id,
          question_text: q.question_text,
          sort_order: q.sort_order,
          placeholder: q.placeholder,
        }))
        .sort((a, b) => a.sort_order - b.sort_order);

      const positions: PositionWithQuestions[] = positionRows.map((pos) => {
        const questions = questionRows
          .filter((q) => q.position_id === pos.id)
          .map((q) => ({
            ...q,
            sort_order: q.sort_order,
            position_id: q.position_id,
          }))
          .sort((a, b) => a.sort_order - b.sort_order);
        return {
          id: pos.id,
          position_id: pos.position_id,
          name: pos.name,
          questions,
        };
      });

      return { generalQuestions, positions };
    } catch (error) {
      throw new ApiError(
        `Failed to get positions with questions: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getProfileAutofill(userId: string): Promise<ProfileAutofill | null> {
    try {
      return await this.repository.getProfileForAutofill(userId);
    } catch (error) {
      throw new ApiError(
        `Failed to get profile for autofill: ${(error as Error).message}`,
        500,
      );
    }
  }

  async createApplication(
    userId: string,
    termId: string,
  ): Promise<ApplicationWithDetails> {
    try {
      const existing = await this.repository.getApplicationByUserAndTerm(
        userId,
        termId,
      );
      if (existing) {
        if (existing.status === "draft") return existing;
        throw new ApiError(
          "You have already submitted an application for this term",
          400,
        );
      }

      const profile = await this.repository.getProfileForAutofill(userId);
      const fullName =
        profile?.first_name && profile?.last_name
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : "Applicant";

      const app = await this.repository.createApplication({
        profile_id: userId,
        term_id: termId,
        full_name: fullName,
      });

      return {
        ...app,
        position_selections: [],
        answers: [],
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to create application: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getApplicationForUser(
    userId: string,
    termId: string,
  ): Promise<ApplicationWithDetails | null> {
    try {
      return await this.repository.getApplicationByUserAndTerm(userId, termId);
    } catch (error) {
      throw new ApiError(
        `Failed to get application: ${(error as Error).message}`,
        500,
      );
    }
  }

  async updateApplication(
    applicationId: string,
    userId: string,
    data: ApplicationUpdatePayload,
  ): Promise<ApplicationWithDetails | null> {
    try {
      const { position_selections, answers, ...applicationData } = data;

      const app = await this.repository.updateApplication(
        applicationId,
        userId,
        applicationData,
      );
      if (!app) return null;

      if (position_selections && position_selections.length > 0) {
        await this.repository.upsertPositionSelections(
          applicationId,
          position_selections,
        );
      }
      if (answers && answers.length > 0) {
        await this.repository.upsertAnswers(applicationId, answers);
      }

      return this.repository.getApplicationByUserAndTerm(userId, app.term_id);
    } catch (error) {
      throw new ApiError(
        `Failed to update application: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const applicationService = new ApplicationService();
