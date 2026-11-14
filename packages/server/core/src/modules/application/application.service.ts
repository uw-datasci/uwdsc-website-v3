import {
  ApiError,
  ApplicationUpdatePayload,
  ApplicationWithDetails,
  GeneralQuestion,
  PositionWithQuestions,
  ProfileAutofill,
  QuestionRow,
  Term,
} from "@uwdsc/common/types";
import { MAX_POSITION_CHOICES } from "@uwdsc/common/constants";
import { isDateWindowOpen } from "@uwdsc/common/utils";
import { ApplicationRepository } from "./application.repository";

/** The active term and whether /apply is open: dates in range and the term's cycle locked. */
export interface ApplyWindow {
  term: Term | null;
  cycleId: string | null;
  open: boolean;
}

class ApplicationService {
  private readonly repository: ApplicationRepository;

  constructor() {
    this.repository = new ApplicationRepository();
  }

  async getActiveTerm(): Promise<Term | null> {
    try {
      return await this.repository.getActiveTerm();
    } catch (error) {
      throw new ApiError(`Failed to get active term: ${(error as Error).message}`, 500);
    }
  }

  async getAllTerms(): Promise<Term[]> {
    try {
      return await this.repository.getAllTerms();
    } catch (error) {
      throw new ApiError(`Failed to get all terms: ${(error as Error).message}`, 500);
    }
  }

  async getApplyWindow(): Promise<ApplyWindow> {
    const term = await this.getActiveTerm();
    if (!term) return { term: null, cycleId: null, open: false };

    try {
      const cycleId = await this.repository.getLockedCycleId(term.id);
      const open =
        cycleId !== null &&
        isDateWindowOpen(term.application_release_date, term.application_hard_deadline);
      return { term, cycleId, open };
    } catch (error) {
      throw new ApiError(`Failed to get application window: ${(error as Error).message}`, 500);
    }
  }

  async getPositionsWithQuestions(cycleId: string): Promise<{
    generalQuestions: GeneralQuestion[];
    positions: PositionWithQuestions[];
  }> {
    try {
      const { positionRows, questionRows } = await this.loadCycleForm(cycleId);

      const generalQuestions = questionRows
        .filter((q) => q.position_id === null)
        .map((q) => ({
          id: q.id,
          question_text: q.question_text,
          type: q.type,
          sort_order: q.sort_order,
          placeholder: q.placeholder,
          max_length: q.max_length,
        }))
        .sort((a, b) => a.sort_order - b.sort_order);

      const positions: PositionWithQuestions[] = positionRows.map((pos) => {
        const questions = questionRows
          .filter((q) => q.position_id !== null && q.position_id === pos.position_id)
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
        500
      );
    }
  }

  async getProfileAutofill(userId: string): Promise<ProfileAutofill | null> {
    try {
      return await this.repository.getProfileForAutofill(userId);
    } catch (error) {
      throw new ApiError(
        `Failed to get profile for autofill: ${(error as Error).message}`,
        500
      );
    }
  }

  async createApplication(userId: string, termId: string): Promise<ApplicationWithDetails> {
    try {
      const existing = await this.repository.getApplicationByUserAndTerm(userId, termId);
      if (existing) {
        if (existing.status === "draft") return existing;
        throw new ApiError("You have already submitted an application for this term", 400);
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
      throw new ApiError(`Failed to create application: ${(error as Error).message}`, 500);
    }
  }

  async getApplicationForUser(
    userId: string,
    termId: string
  ): Promise<ApplicationWithDetails | null> {
    try {
      return await this.repository.getApplicationByUserAndTerm(userId, termId);
    } catch (error) {
      throw new ApiError(`Failed to get application: ${(error as Error).message}`, 500);
    }
  }

  async updateApplication(
    applicationId: string,
    userId: string,
    termId: string,
    cycleId: string,
    data: ApplicationUpdatePayload
  ): Promise<ApplicationWithDetails | null> {
    try {
      const { position_selections, answers: submittedAnswers, ...applicationData } = data;
      const { positionRows, questionRows } = await this.loadCycleForm(cycleId);

      if (position_selections && position_selections.length > 0) {
        this.validateSelections(position_selections, positionRows);
      }

      // Answers to questions no longer on the form (archived, or a closed position) are dropped.
      const answers = submittedAnswers
        ? this.validateAnswers(submittedAnswers, questionRows)
        : undefined;

      const app = await this.repository.updateApplication(
        applicationId,
        userId,
        termId,
        applicationData
      );
      if (!app) return null;

      if (position_selections && position_selections.length > 0) {
        await this.repository.upsertPositionSelections(applicationId, position_selections);
      }
      if (answers && answers.length > 0) {
        await this.repository.upsertAnswers(applicationId, answers);
      }

      return this.repository.getApplicationByUserAndTerm(userId, app.term_id);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to update application: ${(error as Error).message}`, 500);
    }
  }

  private async loadCycleForm(cycleId: string) {
    const positionRows = await this.repository.getAvailablePositions(cycleId);
    const questionRows = await this.repository.getQuestionsForPositions(
      positionRows.map((p) => Number(p.position_id))
    );
    return { positionRows, questionRows };
  }

  private validateSelections(
    selections: NonNullable<ApplicationUpdatePayload["position_selections"]>,
    positionRows: { id: string }[]
  ): void {
    const openIds = new Set(positionRows.map((p) => String(p.id)));
    const priorities = new Set<number>();
    for (const selection of selections) {
      if (selection.position_id && !openIds.has(String(selection.position_id))) {
        throw new ApiError("One of the selected positions is no longer open", 400);
      }
      const { priority } = selection;
      if (!Number.isInteger(priority) || priority < 1 || priority > MAX_POSITION_CHOICES) {
        throw new ApiError(
          `Each position needs a choice number from 1 to ${MAX_POSITION_CHOICES}`,
          400
        );
      }
      if (priorities.has(priority)) {
        throw new ApiError("Two positions have the same choice number", 400);
      }
      priorities.add(priority);
    }
  }

  private validateAnswers(
    answers: NonNullable<ApplicationUpdatePayload["answers"]>,
    questionRows: QuestionRow[]
  ): NonNullable<ApplicationUpdatePayload["answers"]> {
    const maxLengthById = new Map(
      questionRows.map((row) => [String(row.id), row.max_length] as const)
    );

    return answers.filter((answer) => {
      const key = String(answer.question_id);
      if (!maxLengthById.has(key)) return false;
      const maxLength = maxLengthById.get(key);
      if (typeof maxLength === "number" && answer.answer_text.length > maxLength) {
        throw new ApiError(`Answer exceeds max length (${maxLength} characters)`, 400);
      }
      return true;
    });
  }
}

export const applicationService = new ApplicationService();
