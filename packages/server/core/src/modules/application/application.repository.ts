import type {
  Answer,
  AnswerInput,
  Application,
  ApplicationPositionRow,
  ApplicationPositionSelection,
  ApplicationWithDetails,
  CreateApplicationData,
  PositionSelectionInput,
  ProfileAutofill,
  QuestionRow,
  Term,
  UpdateApplicationData,
} from "@uwdsc/common/types";
import { BaseRepository } from "@uwdsc/db/base.repository";

export class ApplicationRepository extends BaseRepository {
  async getActiveTerm(): Promise<Term | null> {
    const result = await this.sql<Term[]>`
      SELECT
        id,
        code,
        is_active,
        application_release_date,
        application_soft_deadline,
        application_hard_deadline,
        start_date,
        end_date,
        onboarding_due_date,
        returning_exec_release_date,
        returning_exec_deadline,
        created_at
      FROM public.terms
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return result[0] ?? null;
  }

  async getAllTerms(): Promise<Term[]> {
    const result = await this.sql<Term[]>`
      SELECT
        id,
        code,
        is_active,
        application_release_date,
        application_soft_deadline,
        application_hard_deadline,
        start_date,
        end_date,
        onboarding_due_date,
        returning_exec_release_date,
        returning_exec_deadline,
        created_at
      FROM public.terms
      ORDER BY start_date DESC NULLS LAST
    `;
    return result;
  }

  /** The term's hiring cycle, only once its leadership roster is locked. */
  async getLockedCycleId(termId: string): Promise<string | null> {
    const result = await this.sql<{ id: string }[]>`
      SELECT id
      FROM hiring.cycles
      WHERE term_id = ${termId} AND roster_locked_at IS NOT NULL
      LIMIT 1
    `;
    return result[0]?.id ?? null;
  }

  async getAvailablePositions(cycleId: string): Promise<ApplicationPositionRow[]> {
    const result = await this.sql<ApplicationPositionRow[]>`
      SELECT
        apa.id,
        ep.id as position_id,
        ep.name
      FROM hiring.application_positions_available apa
      JOIN org.exec_positions ep ON apa.position_id = ep.id
      WHERE apa.cycle_id = ${cycleId} AND apa.is_open = true
      ORDER BY ep.name
    `;
    return result;
  }

  /** General questions plus those for the given exec positions; archived ones are excluded. */
  async getQuestionsForPositions(execPositionIds: number[]): Promise<QuestionRow[]> {
    const result = await this.sql<QuestionRow[]>`
      SELECT
        q.id,
        q.question_text,
        q.type,
        q.max_length,
        q.placeholder,
        q.help_text,
        q.created_at,
        pq.position_id,
        pq.sort_order
      FROM hiring.questions q
      JOIN hiring.position_questions pq ON q.id = pq.question_id
      WHERE q.archived_at IS NULL
        AND (pq.position_id IS NULL OR pq.position_id = ANY(${this.sql.array(execPositionIds)}::int[]))
      ORDER BY pq.sort_order ASC, q.created_at ASC
    `;
    return result;
  }

  async getApplicationByUserAndTerm(
    profileId: string,
    termId: string
  ): Promise<ApplicationWithDetails | null> {
    const apps = await this.sql<Application[]>`
      SELECT
        id,
        profile_id,
        term_id,
        full_name,
        major,
        year_of_study,
        personal_email,
        location,
        club_experience,
        linkedin_url,
        github_url,
        portfolio_url,
        status,
        submitted_at,
        applicant_role
      FROM hiring.applications
      WHERE profile_id = ${profileId} AND term_id = ${termId}
      LIMIT 1
    `;

    const app = apps[0];
    if (!app) return null;

    const selections = await this.sql<ApplicationPositionSelection[]>`
      SELECT
        id,
        application_id,
        position_id,
        priority,
        status
      FROM hiring.application_position_selections
      WHERE application_id = ${app.id}
      ORDER BY priority
    `;

    const answers = await this.sql<Answer[]>`
      SELECT
        id,
        application_id,
        question_id,
        answer_text,
        question_text
      FROM hiring.answers
      WHERE application_id = ${app.id}
    `;

    return {
      ...app,
      position_selections: selections,
      answers,
    };
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    const result = await this.sql<Application[]>`
      INSERT INTO hiring.applications (profile_id, term_id, full_name, status)
      VALUES (${data.profile_id}, ${data.term_id}, ${data.full_name}, 'draft')
      RETURNING
        id,
        profile_id,
        term_id,
        full_name,
        major,
        year_of_study,
        personal_email,
        location,
        club_experience,
        linkedin_url,
        github_url,
        portfolio_url,
        status,
        submitted_at,
        applicant_role
    `;
    const app = result[0];
    if (!app) throw new Error("Failed to create application");
    return app;
  }

  /**
   * Update the user's draft for the given term. Scoped to `termId` so a leftover
   * draft from an earlier term can't be edited or submitted into a new cycle.
   * On submit, `applicant_role` snapshots the applicant's current `user_roles.role`
   * (read from the DB, not the JWT) for the Returning badge.
   */
  async updateApplication(
    id: string,
    userId: string,
    termId: string,
    data: UpdateApplicationData
  ): Promise<Application | null> {
    const result = await this.sql<Application[]>`
      UPDATE hiring.applications
      SET
        full_name = COALESCE(${data.full_name ?? null}, full_name),
        major = COALESCE(${data.major ?? null}, major),
        year_of_study = COALESCE(${data.year_of_study ?? null}, year_of_study),
        personal_email = COALESCE(${data.personal_email ?? null}, personal_email),
        location = COALESCE(${data.location ?? null}, location),
        club_experience = COALESCE(${data.club_experience ?? null}, club_experience),
        linkedin_url = COALESCE(${data.linkedin_url ?? null}, linkedin_url),
        github_url = COALESCE(${data.github_url ?? null}, github_url),
        portfolio_url = COALESCE(${data.portfolio_url ?? null}, portfolio_url)
        ${
          data.submit
            ? this.sql`, status = 'submitted', submitted_at = NOW(),
                applicant_role = (SELECT role FROM public.user_roles WHERE id = ${userId})`
            : this.sql``
        }
      WHERE id = ${id} AND profile_id = ${userId} AND term_id = ${termId} AND status = 'draft'
      RETURNING id, profile_id, term_id, full_name, major, year_of_study,
                personal_email, location, club_experience, linkedin_url,
                github_url, portfolio_url, status, submitted_at, applicant_role
    `;
    return result[0] ?? null;
  }

  async upsertPositionSelections(
    applicationId: string,
    selections: PositionSelectionInput[]
  ): Promise<void> {
    await this.sql`
      DELETE FROM hiring.application_position_selections
      WHERE application_id = ${applicationId}
    `;

    for (const sel of selections) {
      if (!sel.position_id) continue;
      await this.sql`
        INSERT INTO hiring.application_position_selections (application_id, position_id, priority)
        VALUES (${applicationId}, ${sel.position_id}, ${sel.priority})
      `;
    }
  }

  async upsertAnswers(applicationId: string, answers: AnswerInput[]): Promise<void> {
    await this.sql`
      DELETE FROM hiring.answers
      WHERE application_id = ${applicationId}
    `;

    for (const ans of answers) {
      if (!ans.question_id || ans.answer_text == null) continue;
      await this.sql`
        INSERT INTO hiring.answers (application_id, question_id, answer_text, question_text)
        SELECT ${applicationId}, q.id, ${ans.answer_text}, q.question_text
        FROM hiring.questions q
        WHERE q.id = ${ans.question_id}
      `;
    }
  }

  async getProfileForAutofill(userId: string): Promise<ProfileAutofill | null> {
    const result = await this.sql<ProfileAutofill[]>`
      SELECT p.first_name, p.last_name, au.email, p.term
      FROM profiles p
      JOIN auth.users au ON p.id = au.id
      WHERE p.id = ${userId}
      LIMIT 1
    `;
    return result[0] ?? null;
  }
}
