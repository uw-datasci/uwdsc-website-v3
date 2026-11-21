import { BaseRepository } from "@uwdsc/db/base.repository";

export interface SubteamRow {
  id: number;
  name: string;
  retired_at: string | null;
  vp_positions: number;
}

export interface PositionNameRow {
  id: number;
  name: string;
  subteam_name: string | null;
}

export class StructureRepository extends BaseRepository {
  async getSubteam(id: number): Promise<SubteamRow | null> {
    const rows = await this.sql<SubteamRow[]>`
      SELECT s.id, s.name, s.retired_at,
             (SELECT COUNT(*)::int FROM org.exec_positions ep
              WHERE ep.subteam_id = s.id AND ep.is_vp) AS vp_positions
      FROM org.subteams s
      WHERE s.id = ${id}
    `;
    return rows[0] ?? null;
  }

  /** Case-insensitive, so "events" and "Events" can't both exist. */
  async findSubteamByName(name: string): Promise<SubteamRow | null> {
    const rows = await this.sql<SubteamRow[]>`
      SELECT s.id, s.name, s.retired_at,
             (SELECT COUNT(*)::int FROM org.exec_positions ep
              WHERE ep.subteam_id = s.id AND ep.is_vp) AS vp_positions
      FROM org.subteams s
      WHERE lower(s.name) = lower(${name})
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  async findPositionByName(name: string): Promise<PositionNameRow | null> {
    const rows = await this.sql<PositionNameRow[]>`
      SELECT ep.id, ep.name, s.name AS subteam_name
      FROM org.exec_positions ep
      LEFT JOIN org.subteams s ON s.id = ep.subteam_id
      WHERE lower(ep.name) = lower(${name})
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  /** A subteam and its first VP position, together. */
  async createSubteam(
    name: string,
    vpPositionName: string
  ): Promise<{ subteamId: number; positionId: number }> {
    return this.sql.begin(async (sql) => {
      const [subteam] = await sql<{ id: number }[]>`
        INSERT INTO org.subteams (name) VALUES (${name}) RETURNING id
      `;
      if (!subteam) throw new Error("Subteam insert returned nothing");
      const [position] = await sql<{ id: number }[]>`
        INSERT INTO org.exec_positions (name, is_vp, subteam_id)
        VALUES (${vpPositionName}, true, ${subteam.id})
        RETURNING id
      `;
      if (!position) throw new Error("Position insert returned nothing");
      return { subteamId: subteam.id, positionId: position.id };
    });
  }

  /** Bring back a retired subteam, adding a VP position if it has none. */
  async restoreSubteam(id: number, vpPositionName: string | null): Promise<number | null> {
    return this.sql.begin(async (sql) => {
      await sql`
        UPDATE org.subteams
        SET retired_at = NULL, retired_in_cycle_id = NULL
        WHERE id = ${id}
      `;
      if (!vpPositionName) return null;
      const [position] = await sql<{ id: number }[]>`
        INSERT INTO org.exec_positions (name, is_vp, subteam_id)
        VALUES (${vpPositionName}, true, ${id})
        RETURNING id
      `;
      return position?.id ?? null;
    });
  }

  /** A position on a subteam, optionally opened in a cycle in the same transaction. */
  async createPosition(input: {
    subteamId: number;
    name: string;
    isVp: boolean;
    openInCycleId: string | null;
  }): Promise<number> {
    return this.sql.begin(async (sql) => {
      const [position] = await sql<{ id: number }[]>`
        INSERT INTO org.exec_positions (name, is_vp, subteam_id)
        VALUES (${input.name}, ${input.isVp}, ${input.subteamId})
        RETURNING id
      `;
      if (!position) throw new Error("Position insert returned nothing");
      if (input.openInCycleId) {
        await sql`
          INSERT INTO hiring.application_positions_available (cycle_id, position_id, is_open, openings)
          VALUES (${input.openInCycleId}, ${position.id}, true, 1)
        `;
      }
      return position.id;
    });
  }
}
