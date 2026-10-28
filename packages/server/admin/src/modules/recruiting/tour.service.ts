import type { RecruitingTour } from "@uwdsc/common/constants";
import { TourRepository } from "./tour.repository";

class TourService {
  private readonly repository = new TourRepository();

  getCompleted(profileId: string): Promise<string[]> {
    return this.repository.getCompleted(profileId);
  }

  complete(profileId: string, tour: RecruitingTour): Promise<void> {
    return this.repository.complete(profileId, tour);
  }
}

export const tourService = new TourService();
