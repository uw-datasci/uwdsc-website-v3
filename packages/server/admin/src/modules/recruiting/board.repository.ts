import { BaseRepository } from "@uwdsc/db/base.repository";
import type { ApplicationReviewStatus, UserRole } from "@uwdsc/common/types";

export interface BoardCardRow {
  id: string;
  application_id: string;
  profile_id: string;
  full_name: string;
  email: string | null;
  major: string | null;
  year_of_study: string | null;
  applicant_role: UserRole | null;
  priority: number;
  status: ApplicationReviewStatus;
  position_id: number;
  position_name: string;
  is_vp: boolean;
  subteam_id: number | null;
  subteam_name: string | null;
  note_count: number;
  offer_expires_at: string | null;
}

export interface BoardPositionRow {
  id: number;
  name: string;
  is_vp: boolean;
  subteam_id: number | null;
  subteam_name: string | null;
}

export interface SelectionScopeRow {
  id: string;
  status: ApplicationReviewStatus;
  is_vp: boolean;
  subteam_id: number | null;
}

export class BoardRepository extends BaseRepository {
  /** Every submitted card in the cycle, with the candidate's note count. */
  async getCards(cycleId: string, termId: string): Promise<BoardCardRow[]> {
    return this.sql<BoardCardRow[]>`
      SELECT
        s.id,
        s.application_id,
        a.profile_id,
        a.full_name,
        au.email,
        a.major,
        a.year_of_study,
        a.applicant_role,
        s.priority,
        s.status,
        ep.id AS position_id,
        ep.name AS position_name,
        ep.is_vp,
        ep.subteam_id,
        st.name AS subteam_name,
        COALESCE(n.note_count, 0)::int AS note_count,
        o.expires_at AS offer_expires_at
      FROM hiring.application_position_selections s
      JOIN hiring.applications a ON a.id = s.application_id
      JOIN hiring.application_positions_available apa ON apa.id = s.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      LEFT JOIN auth.users au ON au.id = a.profile_id
      LEFT JOIN (
        SELECT candidate_profile_id, COUNT(*) AS note_count
        FROM hiring.candidate_notes
        WHERE cycle_id = ${cycleId} AND deleted_at IS NULL
        GROUP BY candidate_profile_id
      ) n ON n.candidate_profile_id = a.profile_id
      LEFT JOIN hiring.offers o
        ON o.selection_id = s.id
        AND o.withdrawn_at IS NULL
        AND o.response IS NULL
        AND s.status = 'Offer Sent'
      WHERE apa.cycle_id = ${cycleId}
        AND a.term_id = ${termId}
        AND a.status <> 'draft'
      ORDER BY s.priority, a.full_name, s.id
    `;
  }

  async getPositions(cycleId: string): Promise<BoardPositionRow[]> {
    return this.sql<BoardPositionRow[]>`
      SELECT ep.id, ep.name, ep.is_vp, ep.subteam_id, st.name AS subteam_name
      FROM hiring.application_positions_available apa
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      WHERE apa.cycle_id = ${cycleId}
      ORDER BY st.name NULLS FIRST, ep.is_vp DESC, ep.name
    `;
  }

  /** A selection in the cycle with the position fields scope checks need. */
  async getSelection(
    cycleId: string,
    termId: string,
    selectionId: string
  ): Promise<SelectionScopeRow | null> {
    const rows = await this.sql<SelectionScopeRow[]>`
      SELECT s.id, s.status, ep.is_vp, ep.subteam_id
      FROM hiring.application_position_selections s
      JOIN hiring.applications a ON a.id = s.application_id
      JOIN hiring.application_positions_available apa ON apa.id = s.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      WHERE s.id = ${selectionId}
        AND apa.cycle_id = ${cycleId}
        AND a.term_id = ${termId}
        AND a.status <> 'draft'
    `;
    return rows[0] ?? null;
  }

  /**
   * Move a card if it's still at `from`, and log it. Returns false when someone else
   * moved it first.
   */
  async moveSelection(
    selectionId: string,
    from: ApplicationReviewStatus,
    to: ApplicationReviewStatus,
    actorId: string,
    reason: string | null
  ): Promise<boolean> {
    return this.sql.begin(async (sql) => {
      const updated = await sql`
        UPDATE hiring.application_position_selections
        SET status = ${to}
        WHERE id = ${selectionId} AND status = ${from}
        RETURNING id
      `;
      if (updated.length === 0) return false;

      await sql`
        INSERT INTO hiring.selection_events (selection_id, actor_id, from_status, to_status, reason)
        VALUES (${selectionId}, ${actorId}, ${from}, ${to}, ${reason})
      `;
      return true;
    });
  }
}
