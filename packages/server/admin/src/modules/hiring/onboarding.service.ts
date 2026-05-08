import { OnboardingRepository } from "./onboarding.repository";
import {
  ApiError,
  ExecPosition,
  Term,
  Onboarding,
  OnboardingData,
  OnboardingAdminRow,
} from "@uwdsc/common/types";
import { isOnboardingWindowOpen } from "@uwdsc/common/utils";

class OnboardingService {
  private readonly repository: OnboardingRepository;

  constructor() {
    this.repository = new OnboardingRepository();
  }

  /**
   * Get current exec role id for the authenticated user
   */
  async getExecPosId(profile_id: string): Promise<number | null> {
    try {
      return await this.repository.getExecPosId(profile_id);
    } catch (error) {
      throw new ApiError(`Failed to get current exec role: ${(error as Error).message}`, 500);
    }
  }

  async getExecSubteamId(profile_id: string): Promise<number | null> {
    try {
      return await this.repository.getExecSubteamId(profile_id);
    } catch (error) {
      throw new ApiError(`Failed to get current exec role: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get all exec positions for onboarding application form dropdown
   */
  async getExecPositions(): Promise<ExecPosition[]> {
    try {
      return await this.repository.getExecPositions();
    } catch (error) {
      throw new ApiError(`Failed to get exec positions: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get active term for onboarding application form
   */
  async getActiveTerm(): Promise<Term | null> {
    try {
      return await this.repository.getActiveTerm();
    } catch (error) {
      throw new ApiError(`Failed to get active term: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get onboarding application with form values
   */
  async getSubmission(profile_id: string, term_id: string): Promise<Onboarding | null> {
    try {
      const active = await this.repository.getActiveTerm();
      if (!active) throw new ApiError("No active term found", 400);
      if (active.id !== term_id) throw new ApiError("Invalid term", 400);

      if (!isOnboardingWindowOpen(active)) {
        throw new ApiError("Exec onboarding is not open for the active term", 403);
      }
      return await this.repository.getSubmission(profile_id, term_id);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to get onboarding submission: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Create onboarding application with form values
   */
  async saveSubmission(data: OnboardingData, profile_id: string): Promise<Onboarding | null> {
    try {
      const active = await this.repository.getActiveTerm();
      if (!active) throw new ApiError("No active term found", 400);
      if (active.id !== data.term_id) throw new ApiError("Invalid term", 400);

      if (!isOnboardingWindowOpen(active)) {
        throw new ApiError("Exec onboarding is not open for the active term", 403);
      }
      return await this.repository.saveSubmission(data, profile_id);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to save onboarding submission: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get onboarding submissions for all exec/admin users in a term.
   */
  async getTeamSubmissions(
    term_id: string,
    subteam_id?: number,
  ): Promise<OnboardingAdminRow[]> {
    try {
      return await this.repository.getTeamSubmissions(term_id, subteam_id);
    } catch (error) {
      throw new ApiError(
        `Failed to get onboarding submissions: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const onboardingService = new OnboardingService();
