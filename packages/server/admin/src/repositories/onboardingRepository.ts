import { BaseRepository } from "@uwdsc/db/baseRepository";
import type {
  ExecPosition,
  Term,
  Onboarding,
  OnboardingData,
} from "@uwdsc/common/types";


export class OnboardingRepository extends BaseRepository {
  async getCurrentExecRoleId(profile_id: string): Promise<number | null> {
    const result = await this.sql<{ position_id: number }[]>`
      SELECT position_id
      FROM public.exec_team
      WHERE profile_id = ${profile_id}
      ORDER BY updated_at DESC, created_at DESC
      LIMIT 1
    `;

    return result[0]?.position_id ?? null;
  }

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
            onboarding_due_date
        FROM terms
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT 1
        `;
        return result[0] ?? null;
    }

    async getSubmission(
      profile_id: string,
      term_id: string,
    ): Promise<Onboarding | null> {
      const result = await this.sql<Onboarding[]>`
        SELECT *
        FROM public.exec_form_submissions
        WHERE profile_id = ${profile_id}
          AND term_id = ${term_id}
        LIMIT 1
      `;

      return result[0] ?? null;
    }

    async saveSubmission(
      data: OnboardingData,
      profile_id: string,
    ): Promise<Onboarding | null> {
        const result = await this.sql<Onboarding[]>`
        INSERT INTO public.exec_form_submissions (
        profile_id,
        term_id,
        email,
        role_id,
        in_waterloo,
        term_type,
        instagram,
        headshot_url,
        consent_website,
        consent_instagram,
        discord,
        datasci_competency,
        anything_else
        ) VALUES (
        ${profile_id},
        ${data.term_id},
        ${data.email},
        ${data.role_id},
        ${data.in_waterloo ?? null},
        ${data.term_type}::term_type_enum,
        ${data.instagram ?? null},
        ${data.headshot_url ?? null},
        ${data.consent_website},
        ${data.consent_instagram},
        ${data.discord},
        ${data.datasci_competency},
        ${data.anything_else ?? null}
        )
        ON CONFLICT (profile_id, term_id)
        DO UPDATE SET
        email = EXCLUDED.email,
        role_id = EXCLUDED.role_id,
        in_waterloo = EXCLUDED.in_waterloo,
        term_type = EXCLUDED.term_type::term_type_enum,
        instagram = EXCLUDED.instagram,
        headshot_url = EXCLUDED.headshot_url,
        consent_website = EXCLUDED.consent_website,
        consent_instagram = EXCLUDED.consent_instagram,
        discord = EXCLUDED.discord,
        datasci_competency = EXCLUDED.datasci_competency,
        anything_else = EXCLUDED.anything_else,
        updated_at = NOW()
        RETURNING *
    `;

    await this.sql`
      UPDATE public.exec_team
      SET
        photo_url = COALESCE(NULLIF(${data.headshot_url ?? null}::text, ''), photo_url),
        instagram = ${data.instagram}::text,
        updated_at = NOW()
      WHERE profile_id = ${profile_id}::uuid
    `;
      return result[0] ?? null;
    }
}

export const onboardingService = new OnboardingRepository();
