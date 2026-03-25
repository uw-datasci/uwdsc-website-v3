import { BaseRepository } from "@uwdsc/db/baseRepository";
import type { ExecPosition } from "@uwdsc/common/types";

export class OnboardingRepository extends BaseRepository {
  /* Get all exec positions for onboarding application form dropdown */
  async getExecPositions(): Promise<ExecPosition[]> {
    const result = await this.sql<ExecPosition[]>`
        SELECT
        id,
        name
        FROM exec_positions
        ORDER BY name
    `;
    return result;
  }
}

export const onboardingService = new OnboardingRepository();
