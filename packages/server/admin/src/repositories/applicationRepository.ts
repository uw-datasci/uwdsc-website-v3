import { BaseRepository } from "@uwdsc/db/baseRepository";
import type {
  Application,
  PositionSelectionWithName,
  AnswerWithQuestion,
  ApplicationListItem,
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
}
