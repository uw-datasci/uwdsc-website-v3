import { OnboardingRepository } from "../repositories/onboardingRepository";
import { ApiError, ExecPosition } from "@uwdsc/common/types";

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
}

export const onboardingService = new OnboardingService();
