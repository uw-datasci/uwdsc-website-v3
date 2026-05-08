import { BaseRepository } from "@uwdsc/db/base.repository";
import type {
  ApplicationReviewStatus,
  ReturningExecListItem,
  ReturningExecOwnSubmission,
  ReturningExecPositionSelection,
  ReturningExecSubmissionData,
  Term,
} from "@uwdsc/common/types";
import type { ReturningExecRow, SelectionRow } from "../../types/application";

export class ReturningExecRepository extends BaseRepository {
  async getSubmission(
    profile_id: string,
    term_id: string,
  ): Promise<ReturningExecOwnSubmission | null> {
    const rows = await this.sql<ReturningExecRow[]>`
      SELECT * FROM public.returning_exec_submissions
      WHERE profile_id = ${profile_id} AND term_id = ${term_id}
      LIMIT 1
    `;
    const row = rows[0];
    if (!row) return null;

    const selections = await this.getSelectionsForSubmission(row.id);
    return { ...row, position_selections: selections };
  }

  async upsertSubmission(
    profile_id: string,
    data: ReturningExecSubmissionData,
  ): Promise<ReturningExecOwnSubmission> {
    const {
      position_selections,
      interested_in_returning,
      not_returning_reason,
      in_person_next_term,
      qualifications,
      ...rest
    } = data;

    const rows = await this.sql<ReturningExecRow[]>`
      INSERT INTO public.returning_exec_submissions (
        profile_id, term_id, email, full_name, discord, past_positions,
        interested_in_returning, not_returning_reason,
        in_person_next_term, qualifications, additional_notes
      ) VALUES (
        ${profile_id}, ${rest.term_id}, ${rest.email}, ${rest.full_name},
        ${rest.discord}, ${rest.past_positions},
        ${interested_in_returning}, ${not_returning_reason ?? null},
        ${in_person_next_term}, ${qualifications}, ${rest.additional_notes ?? null}
      )
      ON CONFLICT (profile_id, term_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        discord = EXCLUDED.discord,
        past_positions = EXCLUDED.past_positions,
        interested_in_returning = EXCLUDED.interested_in_returning,
        not_returning_reason = EXCLUDED.not_returning_reason,
        in_person_next_term = EXCLUDED.in_person_next_term,
        qualifications = EXCLUDED.qualifications,
        additional_notes = EXCLUDED.additional_notes,
        updated_at = NOW()
      RETURNING *
    `;

    const row = rows[0];
    if (!row) throw new Error("Upsert returned no row");

    await this.sql`
      DELETE FROM public.returning_exec_position_selections
      WHERE submission_id = ${row.id}
    `;

    if (position_selections.length > 0) {
      await this.sql`
        INSERT INTO public.returning_exec_position_selections ${this.sql(
        position_selections.map((s) => ({
          submission_id: row.id,
          position_id: s.position_id,
          priority: s.priority,
        })),
      )}
      `;
    }

    const selections = await this.getSelectionsForSubmission(row.id);
    return { ...row, position_selections: selections };
  }

  async getAllSubmissions(term_id: string): Promise<ReturningExecListItem[]> {
    const rows = await this.sql<ReturningExecRow[]>`
      SELECT s.*
      FROM public.returning_exec_submissions s
      WHERE s.term_id = ${term_id}
      ORDER BY s.submitted_at DESC
    `;

    if (rows.length === 0) return [];

    const submissionIds = rows.map((r) => r.id);
    const allSelections = await this.sql<(SelectionRow & { submission_id: string })[]>`
      SELECT
        reps.id,
        reps.submission_id,
        reps.position_id,
        reps.priority,
        reps.status,
        ep.name AS position_name,
        ep.is_vp,
        st.name AS subteam_name
      FROM public.returning_exec_position_selections reps
      JOIN public.application_positions_available apa ON apa.id = reps.position_id
      JOIN public.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN public.subteams st ON st.id = ep.subteam_id
      WHERE reps.submission_id IN ${this.sql(submissionIds)}
      ORDER BY reps.priority
    `;

    const selectionMap = new Map<string, ReturningExecPositionSelection[]>();
    for (const sel of allSelections) {
      const list = selectionMap.get(sel.submission_id) ?? [];
      list.push(sel);
      selectionMap.set(sel.submission_id, list);
    }

    return rows.map((row) => ({
      id: row.id,
      profile_id: row.profile_id,
      full_name: row.full_name,
      email: row.email,
      discord: row.discord,
      past_positions: row.past_positions,
      interested_in_returning: row.interested_in_returning,
      not_returning_reason: row.not_returning_reason,
      in_person_next_term: row.in_person_next_term,
      qualifications: row.qualifications,
      additional_notes: row.additional_notes,
      submitted_at: row.submitted_at,
      position_selections: selectionMap.get(row.id) ?? [],
    }));
  }

  async getHiringSelections(term_id: string): Promise<
    {
      id: string;
      profile_id: string;
      full_name: string;
      email: string;
      submitted_at: string;
      position_selections: (SelectionRow & { submission_id: string })[];
    }[]
  > {
    const HIRING_STATUSES = [
      "Wanted",
      "Not Wanted",
      "Offer Sent",
      "Accepted Offer",
      "Declined Offer",
      "Rejection Sent",
    ] as const;

    const submissions = await this.sql<
      { id: string; profile_id: string; full_name: string; email: string; submitted_at: string }[]
    >`
      SELECT s.id, s.profile_id, s.full_name, s.email, s.submitted_at
      FROM public.returning_exec_submissions s
      WHERE s.term_id = ${term_id}
        AND EXISTS (
          SELECT 1 FROM public.returning_exec_position_selections reps
          WHERE reps.submission_id = s.id
            AND reps.status IN ${this.sql(HIRING_STATUSES)}
        )
      ORDER BY s.submitted_at DESC
    `;

    if (submissions.length === 0) return [];

    const submissionIds = submissions.map((s) => s.id);
    const selections = await this.sql<(SelectionRow & { submission_id: string })[]>`
      SELECT
        reps.id,
        reps.submission_id,
        reps.position_id,
        reps.priority,
        reps.status,
        ep.name AS position_name,
        ep.is_vp,
        st.name AS subteam_name
      FROM public.returning_exec_position_selections reps
      JOIN public.application_positions_available apa ON apa.id = reps.position_id
      JOIN public.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN public.subteams st ON st.id = ep.subteam_id
      WHERE reps.submission_id IN ${this.sql(submissionIds)}
        AND reps.status IN ${this.sql(HIRING_STATUSES)}
      ORDER BY reps.priority
    `;

    const selectionMap = new Map<string, (SelectionRow & { submission_id: string })[]>();
    for (const sel of selections) {
      const list = selectionMap.get(sel.submission_id) ?? [];
      list.push(sel);
      selectionMap.set(sel.submission_id, list);
    }

    return submissions.map((s) => ({
      ...s,
      position_selections: selectionMap.get(s.id) ?? [],
    }));
  }

  async updateSelectionStatus(
    selectionId: string,
    status: ApplicationReviewStatus,
  ): Promise<void> {
    await this.sql`
      UPDATE public.returning_exec_position_selections
      SET status = ${status}::application_review_status_enum
      WHERE id = ${selectionId}
    `;
  }

  async getSelectionById(
    selectionId: string,
  ): Promise<{ id: string; submission_id: string; position_id: number; status: ApplicationReviewStatus } | null> {
    const rows = await this.sql<
      { id: string; submission_id: string; position_id: number; status: ApplicationReviewStatus }[]
    >`
      SELECT reps.id, reps.submission_id, apa.position_id AS position_id, reps.status
      FROM public.returning_exec_position_selections reps
      JOIN public.application_positions_available apa ON apa.id = reps.position_id
      WHERE reps.id = ${selectionId}
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  async getAvailablePositions(): Promise<
    { id: number; position_id: number; name: string }[]
  > {
    return this.sql<{ id: number; position_id: number; name: string }[]>`
      SELECT apa.id, ep.id AS position_id, ep.name
      FROM public.application_positions_available apa
      JOIN public.exec_positions ep ON ep.id = apa.position_id
      ORDER BY ep.name
    `;
  }

  async getActiveTerm(): Promise<Term | null> {
    const rows = await this.sql<Term[]>`
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
    return rows[0] ?? null;
  }

  private async getSelectionsForSubmission(
    submission_id: string,
  ): Promise<ReturningExecPositionSelection[]> {
    return this.sql<ReturningExecPositionSelection[]>`
      SELECT
        reps.id,
        reps.submission_id,
        reps.position_id,
        reps.priority,
        reps.status,
        ep.name AS position_name,
        ep.is_vp,
        st.name AS subteam_name
      FROM public.returning_exec_position_selections reps
      JOIN public.application_positions_available apa ON apa.id = reps.position_id
      JOIN public.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN public.subteams st ON st.id = ep.subteam_id
      WHERE reps.submission_id = ${submission_id}
      ORDER BY reps.priority
    `;
  }
}
