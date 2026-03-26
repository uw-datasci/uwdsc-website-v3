import { BaseRepository } from "@uwdsc/db/baseRepository";
import type {
  ExecPosition,
  Term
} from "@uwdsc/common/types";

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

    async getActiveTerm() : Promise<Term | null> {
        const result = await this.sql<Term[]>`
        SELECT
            id,
            code,
            is_active,
            created_at,
            onboarding_form_start_date,
            onboarding_form_due_date
        FROM terms
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT 1
        `;
        return result[0] ?? null;
    }

}

export const onboardingService = new OnboardingRepository();
