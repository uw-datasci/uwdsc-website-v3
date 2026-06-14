import { BaseRepository } from "@uwdsc/db/base.repository";
import type { ExecTeamRow } from "../../types/team";

export class TeamRepository extends BaseRepository {
  /**
   * Get all exec team members with profile, position, and subteam details.
   * Used for the public team page.
   */
  async getExecTeam(): Promise<ExecTeamRow[]> {
    const result = await this.sql<ExecTeamRow[]>`
      SELECT
        et.id,
        COALESCE(
          NULLIF(TRIM(CONCAT_WS(' ', p.first_name, p.last_name)), ''),
          'Unknown'
        ) AS name,
        et.photo_url,
        et.instagram,
        et.updated_at,
        ep.name AS position_name,
        s.id AS subteam_id,
        s.name AS subteam_name
      FROM org.exec_team et
      JOIN profiles p ON et.profile_id = p.id
      JOIN org.exec_positions ep ON et.position_id = ep.id
      JOIN org.subteams s ON et.subteam_id = s.id
      ORDER BY s.id ASC, et.id ASC
    `;
    return result;
  }
}
