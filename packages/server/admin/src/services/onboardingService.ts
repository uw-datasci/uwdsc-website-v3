import { OnboardingRepository } from "../repositories/onboardingRepository";
import { ApiError, ExecPosition, Term, Onboarding, OnboardingData} from "@uwdsc/common/types";

class OnboardingService {
  private readonly repository: OnboardingRepository;

  constructor() {
    this.repository = new OnboardingRepository();
  }

  /**
   * Get all exec positions for onboarding application form dropdown
   */
  async getExecPositions(): Promise<ExecPosition[]> {
    try {
      return await this.repository.getExecPositions();
    } catch (error) {
      throw new ApiError(
        `Failed to get exec positions: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get active term for onboarding application form
   */
  async getActiveTerm() : Promise<Term | null> {  
    try {
      return await this.repository.getActiveTerm();
    } catch (error) {
      throw new ApiError(
        `Failed to get active term: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get onboarding application with form values
   */
  async getSubmission(
    profile_id: string,
    term_id: string,
  ): Promise<Onboarding | null> {
    try {
      return await this.repository.getSubmission(profile_id, term_id);
    } catch (error) {
      throw new ApiError(
        `Failed to get onboarding submission: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Create onboarding application with form values
   */
  async saveSubmission(
    data: OnboardingData,
    profile_id: string,
  ): Promise<Onboarding|null> {
    try {
      return await this.repository.saveSubmission(data, profile_id);
    } catch (error) {
      throw new ApiError(
        `Failed to save onboarding submission: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const onboardingService = new OnboardingService();
