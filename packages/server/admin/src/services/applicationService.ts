import { ApplicationRepository } from "../repositories/applicationRepository";
import { ApiError, ApplicationListItem } from "@uwdsc/common/types";

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
}

export const applicationService = new ApplicationService();
