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
import { BaseRepository } from "@uwdsc/db/baseRepository";

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
        created_at
      FROM terms
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return result[0] ?? null;
  }

  async getAvailablePositions(): Promise<ApplicationPositionRow[]> {
    const result = await this.sql<ApplicationPositionRow[]>`
      SELECT
        apa.id,
        ep.id as position_id,
        ep.name
      FROM application_positions_available apa
      JOIN exec_positions ep ON apa.position_id = ep.id
      ORDER BY ep.name
    `;
    return result;
  }

  async getQuestionsForPositions(): Promise<QuestionRow[]> {
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
      FROM questions q
      JOIN position_questions pq ON q.id = pq.question_id
      ORDER BY pq.sort_order ASC, q.created_at ASC
    `;
    return result;
  }

  async getApplicationByUserAndTerm(
    profileId: string,
    termId: string,
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
        status,
        submitted_at
      FROM applications
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
      FROM application_position_selections
      WHERE application_id = ${app.id}
      ORDER BY priority
    `;

    const answers = await this.sql<Answer[]>`
      SELECT
        id,
        application_id,
        question_id,
        answer_text
      FROM answers
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
      INSERT INTO applications (profile_id, term_id, full_name, status)
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
        status,
        submitted_at
    `;
    const app = result[0];
    if (!app) throw new Error("Failed to create application");
    return app;
  }

  async updateApplication(
    id: string,
    userId: string,
    data: UpdateApplicationData,
  ): Promise<Application | null> {
    const result = await this.sql<Application[]>`
      UPDATE applications
      SET
        full_name = COALESCE(${data.full_name ?? null}, full_name),
        major = COALESCE(${data.major ?? null}, major),
        year_of_study = COALESCE(${data.year_of_study ?? null}, year_of_study),
        personal_email = COALESCE(${data.personal_email ?? null}, personal_email),
        location = COALESCE(${data.location ?? null}, location),
        club_experience = COALESCE(${data.club_experience ?? null}, club_experience),
        ${data.submit ? this.sql`, status = 'submitted', submitted_at = NOW()` : this.sql``}
      WHERE id = ${id} AND profile_id = ${userId} AND status = 'draft'
      RETURNING id, profile_id, term_id, full_name, major, year_of_study,
                personal_email, location, club_experience, status, submitted_at
    `;
    return result[0] ?? null;
  }

  async upsertPositionSelections(
    applicationId: string,
    selections: PositionSelectionInput[],
  ): Promise<void> {
    await this.sql`
      DELETE FROM application_position_selections
      WHERE application_id = ${applicationId}
    `;

    for (const sel of selections) {
      if (!sel.position_id) continue;
      await this.sql`
        INSERT INTO application_position_selections (application_id, position_id, priority)
        VALUES (${applicationId}, ${sel.position_id}, ${sel.priority})
      `;
    }
  }

  async upsertAnswers(applicationId: string, answers: AnswerInput[]): Promise<void> {
    await this.sql`
      DELETE FROM answers
      WHERE application_id = ${applicationId}
    `;

    for (const ans of answers) {
      if (!ans.question_id || ans.answer_text == null) continue;
      await this.sql`
        INSERT INTO answers (application_id, question_id, answer_text)
        VALUES (${applicationId}, ${ans.question_id}, ${ans.answer_text})
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
