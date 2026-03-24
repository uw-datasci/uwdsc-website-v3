import { BaseRepository } from "@uwdsc/db/baseRepository";
import type {
  Application,
  PositionSelectionWithName,
  AnswerWithQuestion,
  ApplicationListItem,
  AppQuestion,
  QuestionPositionOption,
  QuestionScope,
  QuestionUpsertInput,
} from "@uwdsc/common/types";

export class ApplicationRepository extends BaseRepository {
  /**
   * Get all submitted applications with position selections (incl. names) and answers (incl. question text).
   * Excludes draft applications.
   */
  async getAllApplicationsWithDetails(): Promise<ApplicationListItem[]> {
    // 1. Get all submitted applications
    const applications = await this.sql<Application[]>`
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
      WHERE status != 'draft'
      ORDER BY submitted_at DESC
    `;

    if (applications.length === 0) return [];

    const applicationIds = applications.map((a) => a.id);

    // 2. Get all position selections with position names
    const selections = await this.sql<
      (PositionSelectionWithName & { application_id: string })[]
    >`
      SELECT
        aps.id,
        aps.application_id,
        aps.position_id,
        aps.priority,
        aps.status,
        ep.name AS position_name
      FROM application_position_selections aps
      JOIN application_positions_available apa ON aps.position_id = apa.id
      JOIN exec_positions ep ON apa.position_id = ep.id
      WHERE aps.application_id IN ${this.sql(applicationIds)}
      ORDER BY aps.priority
    `;

    // 3. Get all answers with question text
    const answers = await this.sql<(AnswerWithQuestion & { application_id: string })[]>`
      SELECT
        a.id,
        a.application_id,
        a.question_id,
        a.answer_text,
        q.question_text
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      WHERE a.application_id IN ${this.sql(applicationIds)}
    `;

    // 4. Group by application
    const selectionsMap = new Map<string, PositionSelectionWithName[]>();
    for (const sel of selections) {
      const list = selectionsMap.get(sel.application_id) ?? [];
      list.push(sel);
      selectionsMap.set(sel.application_id, list);
    }

    const answersMap = new Map<string, AnswerWithQuestion[]>();
    for (const ans of answers) {
      const list = answersMap.get(ans.application_id) ?? [];
      list.push(ans);
      answersMap.set(ans.application_id, list);
    }

    return applications.map((app) => ({
      ...app,
      position_selections: selectionsMap.get(app.id) ?? [],
      answers: answersMap.get(app.id) ?? [],
    }));
  }

  async getPositionOptions(
    scope: QuestionScope,
  ): Promise<QuestionPositionOption[]> {
    if (scope.isPresident) {
      return this.sql<QuestionPositionOption[]>`
        SELECT
          apa.id,
          ep.name
        FROM application_positions_available apa
        JOIN exec_positions ep ON apa.position_id = ep.id
        LEFT JOIN subteams st ON st.id = ep.subteam_id
        WHERE st.name IS DISTINCT FROM 'Presidents'
        ORDER BY ep.name ASC
      `;
    }

    if (scope.vpPositionIds.length === 0) return [];

    return this.sql<QuestionPositionOption[]>`
      SELECT
        apa.id,
        ep.name
      FROM application_positions_available apa
      JOIN exec_positions ep ON apa.position_id = ep.id
      LEFT JOIN subteams st ON st.id = ep.subteam_id
      WHERE apa.id IN ${this.sql(scope.vpPositionIds)}
        AND st.name IS DISTINCT FROM 'Presidents'
      ORDER BY ep.name ASC
    `;
  }

  async getQuestions(scope: QuestionScope): Promise<AppQuestion[]> {
    if (scope.isPresident) {
      return this.sql<AppQuestion[]>`
        SELECT
          pq.id AS relation_id,
          q.id AS question_id,
          pq.position_id,
          ep.name AS position_name,
          q.question_text,
          q.type,
          q.max_length,
          q.placeholder,
          q.help_text,
          pq.sort_order,
          q.created_at
        FROM position_questions pq
        JOIN questions q ON q.id = pq.question_id
        LEFT JOIN application_positions_available apa ON apa.id = pq.position_id
        LEFT JOIN exec_positions ep ON ep.id = apa.position_id
        ORDER BY ep.name NULLS LAST, pq.sort_order ASC, q.created_at ASC
      `;
    }

    if (scope.vpPositionIds.length === 0) return [];

    return this.sql<AppQuestion[]>`
      SELECT
        pq.id AS relation_id,
        q.id AS question_id,
        pq.position_id,
        ep.name AS position_name,
        q.question_text,
        q.type,
        q.max_length,
        q.placeholder,
        q.help_text,
        pq.sort_order,
        q.created_at
      FROM position_questions pq
      JOIN questions q ON q.id = pq.question_id
      JOIN application_positions_available apa ON apa.id = pq.position_id
      JOIN exec_positions ep ON ep.id = apa.position_id
      WHERE pq.position_id IN ${this.sql(scope.vpPositionIds)}
      ORDER BY ep.name ASC, pq.sort_order ASC, q.created_at ASC
    `;
  }

  async createQuestion(data: QuestionUpsertInput): Promise<AppQuestion> {
    const createdQuestion = await this.sql<
      { id: number; created_at: string }[]
    >`
      INSERT INTO questions (
        question_text,
        type,
        max_length,
        placeholder,
        help_text
      ) VALUES (
        ${data.question_text},
        ${data.type},
        ${data.max_length ?? null},
        ${data.placeholder ?? null},
        ${data.help_text ?? null}
      )
      RETURNING id, created_at
    `;
    const question = createdQuestion[0];
    if (!question) throw new Error("Failed to create question");

    const relation = await this.sql<{ id: number }[]>`
      INSERT INTO position_questions (position_id, question_id, sort_order)
      VALUES (${data.position_id}, ${question.id}, ${data.sort_order})
      RETURNING id
    `;
    const relationId = relation[0]?.id;
    if (!relationId)
      throw new Error("Failed to create position question relation");

    const full = await this.sql<AppQuestion[]>`
      SELECT
        pq.id AS relation_id,
        q.id AS question_id,
        pq.position_id,
        ep.name AS position_name,
        q.question_text,
        q.type,
        q.max_length,
        q.placeholder,
        q.help_text,
        pq.sort_order,
        q.created_at
      FROM position_questions pq
      JOIN questions q ON q.id = pq.question_id
      LEFT JOIN application_positions_available apa ON apa.id = pq.position_id
      LEFT JOIN exec_positions ep ON ep.id = apa.position_id
      WHERE pq.id = ${relationId}
      LIMIT 1
    `;
    const record = full[0];
    if (!record) throw new Error("Failed to load created question");
    return record;
  }

  async updateQuestion(
    relationId: number,
    data: QuestionUpsertInput,
  ): Promise<AppQuestion | null> {
    const relationRows = await this.sql<{ question_id: number }[]>`
      SELECT question_id
      FROM position_questions
      WHERE id = ${relationId}
      LIMIT 1
    `;
    const relation = relationRows[0];
    if (!relation) return null;

    await this.sql`
      UPDATE questions
      SET
        question_text = ${data.question_text},
        type = ${data.type},
        max_length = ${data.max_length ?? null},
        placeholder = ${data.placeholder ?? null},
        help_text = ${data.help_text ?? null}
      WHERE id = ${relation.question_id}
    `;

    await this.sql`
      UPDATE position_questions
      SET
        position_id = ${data.position_id},
        sort_order = ${data.sort_order}
      WHERE id = ${relationId}
    `;

    const full = await this.sql<AppQuestion[]>`
      SELECT
        pq.id AS relation_id,
        q.id AS question_id,
        pq.position_id,
        ep.name AS position_name,
        q.question_text,
        q.type,
        q.max_length,
        q.placeholder,
        q.help_text,
        pq.sort_order,
        q.created_at
      FROM position_questions pq
      JOIN questions q ON q.id = pq.question_id
      LEFT JOIN application_positions_available apa ON apa.id = pq.position_id
      LEFT JOIN exec_positions ep ON ep.id = apa.position_id
      WHERE pq.id = ${relationId}
      LIMIT 1
    `;
    return full[0] ?? null;
  }

  async deleteQuestion(relationId: number): Promise<boolean> {
    const relationRows = await this.sql<{ question_id: number }[]>`
      SELECT question_id
      FROM position_questions
      WHERE id = ${relationId}
      LIMIT 1
    `;
    const relation = relationRows[0];
    if (!relation) return false;

    const deleted = await this.sql`
      DELETE FROM questions
      WHERE id = ${relation.question_id}
      RETURNING id
    `;
    return deleted.length > 0;
  }
}
