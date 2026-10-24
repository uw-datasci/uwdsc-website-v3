import { BaseRepository } from "@uwdsc/db/base.repository";
import type { UserRole } from "@uwdsc/common/types";

export interface CandidateRow {
  id: string;
  profile_id: string;
  full_name: string;
  email: string | null;
  personal_email: string | null;
  major: string | null;
  year_of_study: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  applicant_role: UserRole | null;
  submitted_at: string;
}

export interface CandidatePositionRow {
  priority: number;
  position_id: number;
  position_name: string;
  subteam_name: string | null;
}

/** One row per answer × question link (null position_id = General, null link = unlinked). */
export interface AnswerLinkRow {
  question_id: number;
  question_text: string;
  answer_text: string;
  position_id: number | null;
  linked: boolean;
  sort_order: number | null;
}

export interface PastRoleRow {
  term_code: string;
  position_name: string;
  subteam_name: string | null;
}

export class CandidateRepository extends BaseRepository {
  /** A submitted application in the cycle's term with at least one card in the cycle. */
  async getCandidate(
    cycleId: string,
    termId: string,
    applicationId: string
  ): Promise<CandidateRow | null> {
    const rows = await this.sql<CandidateRow[]>`
      SELECT
        a.id,
        a.profile_id,
        a.full_name,
        au.email,
        a.personal_email,
        a.major,
        a.year_of_study,
        a.location,
        a.linkedin_url,
        a.github_url,
        a.portfolio_url,
        a.applicant_role,
        a.submitted_at
      FROM hiring.applications a
      LEFT JOIN auth.users au ON au.id = a.profile_id
      WHERE a.id = ${applicationId}
        AND a.term_id = ${termId}
        AND a.status <> 'draft'
        AND EXISTS (
          SELECT 1
          FROM hiring.application_position_selections s
          JOIN hiring.application_positions_available apa ON apa.id = s.position_id
          WHERE s.application_id = a.id AND apa.cycle_id = ${cycleId}
        )
    `;
    return rows[0] ?? null;
  }

  async getPositions(cycleId: string, applicationId: string): Promise<CandidatePositionRow[]> {
    return this.sql<CandidatePositionRow[]>`
      SELECT s.priority, ep.id AS position_id, ep.name AS position_name, st.name AS subteam_name
      FROM hiring.application_position_selections s
      JOIN hiring.application_positions_available apa ON apa.id = s.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      WHERE s.application_id = ${applicationId} AND apa.cycle_id = ${cycleId}
      ORDER BY s.priority
    `;
  }

  async getAnswers(applicationId: string): Promise<AnswerLinkRow[]> {
    return this.sql<AnswerLinkRow[]>`
      SELECT
        ans.question_id,
        COALESCE(ans.question_text, q.question_text) AS question_text,
        ans.answer_text,
        pq.position_id,
        (pq.id IS NOT NULL) AS linked,
        pq.sort_order
      FROM hiring.answers ans
      JOIN hiring.questions q ON q.id = ans.question_id
      LEFT JOIN hiring.position_questions pq ON pq.question_id = ans.question_id
      WHERE ans.application_id = ${applicationId}
        AND btrim(ans.answer_text) <> ''
      ORDER BY pq.sort_order NULLS LAST, ans.question_id
    `;
  }

  /** Exec roles on record, newest term first. */
  async getPastRoles(profileId: string): Promise<PastRoleRow[]> {
    return this.sql<PastRoleRow[]>`
      SELECT t.code AS term_code, ep.name AS position_name, st.name AS subteam_name
      FROM org.exec_team et
      JOIN public.terms t ON t.id = et.term_id
      JOIN org.exec_positions ep ON ep.id = et.position_id
      LEFT JOIN org.subteams st ON st.id = et.subteam_id
      WHERE et.profile_id = ${profileId}
      ORDER BY t.start_date DESC
    `;
  }
}
