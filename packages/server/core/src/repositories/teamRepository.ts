import { BaseRepository } from "@uwdsc/db/baseRepository";

interface ExecTeamRow {
  id: number;
  name: string;
  position_name: string;
  subteam_id: number;
  subteam_name: string;
  photo_url: string;
  instagram: string | null;
};

export class TeamRepository extends BaseRepository {
  /**
   * Get all exec team members with profile, position, and subteam details.
   * Used for the public team page.
   */
  async getExecTeam(): Promise<ExecTeamRow[]> {
    const result = await this.sql<ExecTeamRow[]>`
      SELECT
        et.id,
        TRIM(p.first_name || ' ' || p.last_name) AS name,
        et.photo_url,
        et.instagram,
        ep.name AS position_name,
        s.id AS subteam_id,
        s.name AS subteam_name
      FROM exec_team et
      JOIN profiles p ON et.profile_id = p.id
      JOIN exec_positions ep ON et.position_id = ep.id
      JOIN subteams s ON et.subteam_id = s.id
      ORDER BY s.id ASC, et.id ASC
    `;
    return result;
  }
}
