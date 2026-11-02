import { BaseRepository } from "@uwdsc/db/base.repository";
import type { QuestionFields, ScheduleInput } from "@uwdsc/common/schemas";
import type { SetupQuestion, SetupSchedule } from "@uwdsc/common/types";
import type { ApplicationInputType } from "@uwdsc/common/types";

export interface CyclePositionRow {
  id: number;
  position_id: number;
  name: string;
  is_vp: boolean;
  subteam_id: number | null;
  subteam_name: string | null;
  is_open: boolean;
  openings: number;
  applicants: number;
}

export interface ExecPositionRow {
  id: number;
  name: string;
  is_vp: boolean;
  subteam_id: number | null;
  subteam_name: string | null;
}

interface QuestionRow {
  id: number;
  position_id: number | null;
  question_text: string;
  type: ApplicationInputType;
  max_length: number | null;
  placeholder: string | null;
  help_text: string | null;
  sort_order: number | null;
  archived_at: string | null;
  answers: number;
}

export class SetupRepository extends BaseRepository {
  async getSchedule(cycleId: string): Promise<SetupSchedule | null> {
    const rows = await this.sql<
      {
        term_id: string;
        term_code: string;
        application_release_date: string | null;
        application_soft_deadline: string | null;
        application_hard_deadline: string | null;
        target_term_id: string;
        target_term_code: string;
        offer_response_hours: number;
      }[]
    >`
      SELECT
        c.term_id,
        t.code AS term_code,
        t.application_release_date,
        t.application_soft_deadline,
        t.application_hard_deadline,
        c.target_term_id,
        tt.code AS target_term_code,
        c.offer_response_hours
      FROM hiring.cycles c
      JOIN public.terms t ON t.id = c.term_id
      JOIN public.terms tt ON tt.id = c.target_term_id
      WHERE c.id = ${cycleId}
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      termId: row.term_id,
      termCode: row.term_code,
      releaseDate: row.application_release_date,
      softDeadline: row.application_soft_deadline,
      hardDeadline: row.application_hard_deadline,
      targetTermId: row.target_term_id,
      targetTermCode: row.target_term_code,
      offerResponseHours: row.offer_response_hours,
    };
  }

  /** Dates live on the cycle's term (what /apply reads); the rest on the cycle. */
  async updateSchedule(cycleId: string, termId: string, input: ScheduleInput): Promise<void> {
    await this.sql.begin(async (sql) => {
      await sql`
        UPDATE public.terms
        SET
          application_release_date = ${input.releaseDate},
          application_soft_deadline = ${input.softDeadline},
          application_hard_deadline = ${input.hardDeadline}
        WHERE id = ${termId}
      `;
      await sql`
        UPDATE hiring.cycles
        SET target_term_id = ${input.targetTermId}, offer_response_hours = ${input.offerResponseHours}
        WHERE id = ${cycleId}
      `;
    });
  }

  async getExecPositions(): Promise<ExecPositionRow[]> {
    return this.sql<ExecPositionRow[]>`
      SELECT ep.id, ep.name, ep.is_vp, ep.subteam_id, s.name AS subteam_name
      FROM org.exec_positions ep
      LEFT JOIN org.subteams s ON s.id = ep.subteam_id
      ORDER BY ep.subteam_id NULLS LAST, ep.name
    `;
  }

  async getCyclePositions(cycleId: string): Promise<CyclePositionRow[]> {
    return this.sql<CyclePositionRow[]>`
      SELECT
        apa.id,
        apa.position_id,
        ep.name,
        ep.is_vp,
        ep.subteam_id,
        s.name AS subteam_name,
        apa.is_open,
        apa.openings,
        (
          SELECT COUNT(*)::int
          FROM hiring.application_position_selections sel
          WHERE sel.position_id = apa.id
        ) AS applicants
      FROM hiring.application_positions_available apa
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams s ON s.id = ep.subteam_id
      WHERE apa.cycle_id = ${cycleId}
      ORDER BY ep.subteam_id NULLS LAST, ep.is_vp DESC, ep.name
    `;
  }

  /** Next term's VPs by subteam, for "Owned by VP, Events" labels. */
  async getVpSubteams(cycleId: string): Promise<{ subteam_id: number }[]> {
    return this.sql<{ subteam_id: number }[]>`
      SELECT DISTINCT subteam_id
      FROM hiring.cycle_leadership
      WHERE cycle_id = ${cycleId} AND role = 'admin'
    `;
  }

  async addPosition(cycleId: string, positionId: number): Promise<void> {
    await this.sql`
      INSERT INTO hiring.application_positions_available (cycle_id, position_id, is_open, openings)
      VALUES (${cycleId}, ${positionId}, true, 1)
      ON CONFLICT (cycle_id, position_id) DO UPDATE SET is_open = true
    `;
  }

  async getCyclePosition(cycleId: string, id: number): Promise<CyclePositionRow | null> {
    const rows = await this.sql<CyclePositionRow[]>`
      SELECT
        apa.id, apa.position_id, ep.name, ep.is_vp, ep.subteam_id, s.name AS subteam_name,
        apa.is_open, apa.openings, 0 AS applicants
      FROM hiring.application_positions_available apa
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams s ON s.id = ep.subteam_id
      WHERE apa.cycle_id = ${cycleId} AND apa.id = ${id}
    `;
    return rows[0] ?? null;
  }

  async updatePosition(
    id: number,
    patch: { isOpen?: boolean; openings?: number }
  ): Promise<void> {
    await this.sql`
      UPDATE hiring.application_positions_available
      SET
        is_open = COALESCE(${patch.isOpen ?? null}, is_open),
        openings = COALESCE(${patch.openings ?? null}, openings)
      WHERE id = ${id}
    `;
  }

  /** General questions plus those for the given exec positions, archived included. */
  async getQuestions(positionIds: number[]): Promise<SetupQuestion[]> {
    const rows = await this.sql<QuestionRow[]>`
      SELECT
        q.id,
        pq.position_id,
        q.question_text,
        q.type,
        q.max_length,
        q.placeholder,
        q.help_text,
        pq.sort_order,
        q.archived_at,
        (SELECT COUNT(*)::int FROM hiring.answers a WHERE a.question_id = q.id) AS answers
      FROM hiring.questions q
      JOIN hiring.position_questions pq ON pq.question_id = q.id
      WHERE pq.position_id IS NULL OR pq.position_id = ANY(${this.sql.array(positionIds)}::int[])
      ORDER BY pq.position_id NULLS FIRST, pq.sort_order ASC NULLS LAST, q.created_at ASC
    `;
    return rows.map((row) => ({
      id: row.id,
      positionId: row.position_id,
      questionText: row.question_text,
      type: row.type,
      maxLength: row.max_length,
      placeholder: row.placeholder,
      helpText: row.help_text,
      sortOrder: row.sort_order ?? 0,
      archivedAt: row.archived_at,
      answers: row.answers,
    }));
  }

  /** Positions a question is linked to (null = General). */
  async getQuestionLinks(questionId: number): Promise<(number | null)[]> {
    const rows = await this.sql<{ position_id: number | null }[]>`
      SELECT position_id FROM hiring.position_questions WHERE question_id = ${questionId}
    `;
    return rows.map((row) => row.position_id);
  }

  async createQuestion(positionId: number | null, fields: QuestionFields): Promise<number> {
    return this.sql.begin(async (sql) => {
      const [question] = await sql<{ id: number }[]>`
        INSERT INTO hiring.questions (question_text, type, max_length, placeholder, help_text)
        VALUES (
          ${fields.questionText}, ${fields.type}, ${fields.maxLength},
          ${fields.placeholder}, ${fields.helpText}
        )
        RETURNING id
      `;
      if (!question) throw new Error("Failed to create question");

      await sql`
        INSERT INTO hiring.position_questions (position_id, question_id, sort_order)
        SELECT ${positionId}::int, ${question.id}, COALESCE(MAX(sort_order), 0) + 1
        FROM hiring.position_questions
        WHERE position_id IS NOT DISTINCT FROM ${positionId}::int
      `;
      return question.id;
    });
  }

  async updateQuestion(questionId: number, fields: QuestionFields): Promise<void> {
    await this.sql`
      UPDATE hiring.questions
      SET
        question_text = ${fields.questionText},
        type = ${fields.type},
        max_length = ${fields.maxLength},
        placeholder = ${fields.placeholder},
        help_text = ${fields.helpText}
      WHERE id = ${questionId}
    `;
  }

  async setArchived(questionId: number, archived: boolean): Promise<void> {
    await this.sql`
      UPDATE hiring.questions
      SET archived_at = CASE WHEN ${archived}::boolean THEN now() ELSE NULL END
      WHERE id = ${questionId}
    `;
  }

  async reorderQuestions(positionId: number | null, questionIds: number[]): Promise<void> {
    await this.sql.begin(async (sql) => {
      for (const [index, questionId] of questionIds.entries()) {
        await sql`
          UPDATE hiring.position_questions
          SET sort_order = ${index + 1}
          WHERE question_id = ${questionId} AND position_id IS NOT DISTINCT FROM ${positionId}::int
        `;
      }
    });
  }
}
