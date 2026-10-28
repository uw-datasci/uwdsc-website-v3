import { BaseRepository } from "@uwdsc/db/base.repository";

export interface OverviewPositionRow {
  position_id: number;
  name: string;
  subteam_id: number | null;
  subteam_name: string | null;
  is_vp: boolean;
  is_open: boolean;
  openings: number;
  question_count: number;
}

export class OverviewRepository extends BaseRepository {
  /** The cycle's positions with openings and how many live questions each has. */
  async getPositions(cycleId: string): Promise<OverviewPositionRow[]> {
    return this.sql<OverviewPositionRow[]>`
      SELECT
        ep.id AS position_id,
        ep.name,
        ep.subteam_id,
        st.name AS subteam_name,
        ep.is_vp,
        apa.is_open,
        apa.openings,
        (
          SELECT COUNT(*)::int
          FROM hiring.position_questions pq
          JOIN hiring.questions q ON q.id = pq.question_id
          WHERE pq.position_id = ep.id AND q.archived_at IS NULL
        ) AS question_count
      FROM hiring.application_positions_available apa
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      WHERE apa.cycle_id = ${cycleId}
      ORDER BY st.name NULLS FIRST, ep.is_vp DESC, ep.name
    `;
  }
}
