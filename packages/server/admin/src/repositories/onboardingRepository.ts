import { BaseRepository } from "@uwdsc/db/baseRepository";
import type {
  ExecPosition,
  Term,
  Onboarding,
  OnboardingData,
  OnboardingAdminRow,
  UserRole,
} from "@uwdsc/common/types";

const TEAM_DEFAULT_HEADSHOT_URL = "team.png";

export class OnboardingRepository extends BaseRepository {
  private mapAdminRow(row: OnboardingAdminRowDb): OnboardingAdminRow {
    const submission = row.submission_id
      ? {
          id: row.submission_id,
          profile_id: row.profile_id,
          term_id: row.submission_term_id ?? "",
          email: row.submission_email ?? "",
          role_id: row.submission_role_id ?? 0,
          in_waterloo: row.submission_in_waterloo ?? "",
          term_type: row.submission_term_type ?? "study",
          instagram: row.submission_instagram ?? null,
          headshot_url: row.submission_headshot_url ?? null,
          consent_website: row.submission_consent_website ?? false,
          consent_instagram: row.submission_consent_instagram ?? false,
          discord: row.submission_discord ?? "",
          datasci_competency: row.submission_datasci_competency ?? 0,
          anything_else: row.submission_anything_else ?? null,
          submitted_at: row.submission_submitted_at ?? "",
          created_at: row.submission_created_at ?? "",
          updated_at: row.submission_updated_at ?? "",
        }
      : null;

    return {
      profile_id: row.profile_id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      user_role: row.user_role,
      exec_position_id: row.exec_position_id,
      exec_position_name: row.exec_position_name,
      submission_role_id: row.submission_role_id,
      submission_role_name: row.submission_role_name,
      submission,
    };
  }

  async getExecPosId(profile_id: string): Promise<number | null> {
    const result = await this.sql<{ position_id: number }[]>`
      SELECT position_id
      FROM public.exec_team
      WHERE profile_id = ${profile_id}
      ORDER BY updated_at DESC, created_at DESC
      LIMIT 1
    `;

    return result[0]?.position_id ?? null;
  }

  async getExecSubteamId(profile_id: string): Promise<number | null> {
    const result = await this.sql<{ subteam_id: number }[]>`
      SELECT subteam_id
      FROM public.exec_team
      WHERE profile_id = ${profile_id}
      ORDER BY updated_at DESC, created_at DESC
      LIMIT 1
    `;

    return result[0]?.subteam_id ?? null;
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

  async getTeamSubmissions(
    term_id: string,
    subteam_id?: number,
  ): Promise<OnboardingAdminRow[]> {
    const rows = await this.sql<OnboardingAdminRowDb[]>`
      SELECT
        p.id AS profile_id,
        p.first_name,
        p.last_name,
        au.email,
        r.role AS user_role,
        et.position_id AS exec_position_id,
        ep_current.name AS exec_position_name,
        s.id AS submission_id,
        s.term_id AS submission_term_id,
        s.email AS submission_email,
        s.role_id AS submission_role_id,
        ep_submission.name AS submission_role_name,
        s.in_waterloo AS submission_in_waterloo,
        s.term_type AS submission_term_type,
        s.instagram AS submission_instagram,
        s.headshot_url AS submission_headshot_url,
        s.consent_website AS submission_consent_website,
        s.consent_instagram AS submission_consent_instagram,
        s.discord AS submission_discord,
        s.datasci_competency AS submission_datasci_competency,
        s.anything_else AS submission_anything_else,
        s.submitted_at AS submission_submitted_at,
        s.created_at AS submission_created_at,
        s.updated_at AS submission_updated_at
      FROM profiles p
      JOIN auth.users au ON p.id = au.id
      JOIN user_roles r ON p.id = r.id
      LEFT JOIN LATERAL (
        SELECT position_id, subteam_id
        FROM exec_team
        WHERE profile_id = p.id
        ORDER BY updated_at DESC, created_at DESC
        LIMIT 1
      ) et ON true
      LEFT JOIN exec_positions ep_current ON ep_current.id = et.position_id
      LEFT JOIN exec_form_submissions s
        ON s.profile_id = p.id
      AND s.term_id = ${term_id}
      LEFT JOIN exec_positions ep_submission ON ep_submission.id = s.role_id
      WHERE r.role IN ('exec', 'admin')
      ${subteam_id ? this.sql`AND COALESCE(ep_current.subteam_id, et.subteam_id) = ${subteam_id}` : this.sql``}
      ORDER BY r.role DESC, p.first_name NULLS LAST, p.last_name NULLS LAST
    `;

    return rows.map((row) => this.mapAdminRow(row));
  }

  async getActiveTerm(): Promise<Term | null> {
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
    const resolvedHeadshotUrl = data.consent_website
      ? (data.headshot_url ?? null)
      : TEAM_DEFAULT_HEADSHOT_URL;
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
        ${resolvedHeadshotUrl},
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
        photo_url = COALESCE(NULLIF(${resolvedHeadshotUrl}::text, ''), photo_url),
        instagram = ${data.instagram}::text,
        updated_at = NOW()
      WHERE profile_id = ${profile_id}::uuid
    `;
    return result[0] ?? null;
  }
}

export const onboardingService = new OnboardingRepository();

interface OnboardingAdminRowDb {
  profile_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  user_role: UserRole;
  exec_position_id: number | null;
  exec_position_name: string | null;
  submission_id: string | null;
  submission_term_id: string | null;
  submission_email: string | null;
  submission_role_id: number | null;
  submission_role_name: string | null;
  submission_in_waterloo: string | null;
  submission_term_type: "study" | "coop" | null;
  submission_instagram: string | null;
  submission_headshot_url: string | null;
  submission_consent_website: boolean | null;
  submission_consent_instagram: boolean | null;
  submission_discord: string | null;
  submission_datasci_competency: number | null;
  submission_anything_else: string | null;
  submission_submitted_at: string | null;
  submission_created_at: string | null;
  submission_updated_at: string | null;
}
