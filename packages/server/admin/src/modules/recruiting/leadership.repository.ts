import { BaseRepository } from "@uwdsc/db/base.repository";
import type { TransactionSql } from "@uwdsc/db/connection";
import type { HiringPick, LeadershipDraft } from "@uwdsc/common/schemas";
import type {
  CyclePositionInfo,
  ExecPositionInfo,
  LeadershipPerson,
  RoleChange,
  RosterEntry,
} from "@uwdsc/common/types";
import type { CycleEventType, UserRole } from "@uwdsc/common/types";

export interface CurrentLeaderRow {
  profile_id: string;
  role: Extract<UserRole, "pres" | "admin">;
  subteam_id: number | null;
  position_id: number | null;
}

export interface AppliedSeatRow {
  profile_id: string;
  role: Extract<UserRole, "pres" | "admin">;
  position_id: number;
  prior_role: UserRole | null;
  prior_subteam_id: number | null;
}

interface PersonRow {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  subteam_id: number | null;
  position_name: string | null;
}

function toPerson(row: PersonRow): LeadershipPerson {
  return {
    id: row.id,
    name: row.name ?? row.email ?? "Unnamed",
    email: row.email,
    role: row.role,
    subteamId: row.subteam_id,
    positionName: row.position_name,
  };
}

export interface ApplyRosterInput {
  cycleId: string;
  actorId: string;
  draft: LeadershipDraft;
  roster: RosterEntry[];
  changes: RoleChange[];
  lock: boolean;
  positions: { managedIds: number[]; desired: HiringPick[] };
}

export class LeadershipRepository extends BaseRepository {
  async getExecPositions(): Promise<ExecPositionInfo[]> {
    const rows = await this.sql<
      {
        id: number;
        name: string;
        is_vp: boolean;
        subteam_id: number | null;
        subteam_name: string | null;
      }[]
    >`
      SELECT ep.id, ep.name, ep.is_vp, ep.subteam_id, s.name AS subteam_name
      FROM org.exec_positions ep
      LEFT JOIN org.subteams s ON s.id = ep.subteam_id
      ORDER BY ep.subteam_id NULLS LAST, ep.is_vp DESC, ep.name
    `;
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      isVp: row.is_vp,
      subteamId: row.subteam_id,
      subteamName: row.subteam_name,
    }));
  }

  async getPresidentsSubteamId(): Promise<number | null> {
    const rows = await this.sql<{ id: number }[]>`
      SELECT id FROM org.subteams WHERE name = 'Presidents' LIMIT 1
    `;
    return rows[0]?.id ?? null;
  }

  /** Everyone who is a president or VP now, with their exec position for `termId`. */
  async getCurrentLeaders(termId: string): Promise<CurrentLeaderRow[]> {
    return this.sql<CurrentLeaderRow[]>`
      SELECT ur.id AS profile_id, ur.role, ur.subteam_id, et.position_id
      FROM public.user_roles ur
      LEFT JOIN org.exec_team et ON et.profile_id = ur.id AND et.term_id = ${termId}
      WHERE ur.role IN ('pres', 'admin')
    `;
  }

  async getPeople(ids: string[]): Promise<LeadershipPerson[]> {
    if (ids.length === 0) return [];
    const rows = await this.sql<PersonRow[]>`
      SELECT
        p.id,
        NULLIF(TRIM(CONCAT_WS(' ', p.first_name, p.last_name)), '') AS name,
        au.email,
        ur.role,
        ur.subteam_id,
        (
          SELECT ep.name
          FROM org.exec_team et
          JOIN org.exec_positions ep ON ep.id = et.position_id
          WHERE et.profile_id = p.id
          ORDER BY et.created_at DESC
          LIMIT 1
        ) AS position_name
      FROM public.profiles p
      JOIN auth.users au ON au.id = p.id
      JOIN public.user_roles ur ON ur.id = p.id
      WHERE p.id IN ${this.sql(ids)}
    `;
    return rows.map(toPerson);
  }

  async searchPeople(query: string): Promise<LeadershipPerson[]> {
    const pattern = `%${query}%`;
    const rows = await this.sql<PersonRow[]>`
      SELECT
        p.id,
        NULLIF(TRIM(CONCAT_WS(' ', p.first_name, p.last_name)), '') AS name,
        au.email,
        ur.role,
        ur.subteam_id,
        (
          SELECT ep.name
          FROM org.exec_team et
          JOIN org.exec_positions ep ON ep.id = et.position_id
          WHERE et.profile_id = p.id
          ORDER BY et.created_at DESC
          LIMIT 1
        ) AS position_name
      FROM public.profiles p
      JOIN auth.users au ON au.id = p.id
      JOIN public.user_roles ur ON ur.id = p.id
      WHERE CONCAT_WS(' ', p.first_name, p.last_name) ILIKE ${pattern}
         OR au.email ILIKE ${pattern}
         OR p.wat_iam ILIKE ${pattern}
      ORDER BY p.first_name, p.last_name
      LIMIT 10
    `;
    return rows.map(toPerson);
  }

  async getDraft(cycleId: string): Promise<unknown> {
    const rows = await this.sql<{ leadership_draft: unknown }[]>`
      SELECT leadership_draft FROM hiring.cycles WHERE id = ${cycleId}
    `;
    return rows[0]?.leadership_draft ?? null;
  }

  async getAppliedRoster(cycleId: string): Promise<AppliedSeatRow[]> {
    return this.sql<AppliedSeatRow[]>`
      SELECT profile_id, role, position_id, prior_role, prior_subteam_id
      FROM hiring.cycle_leadership
      WHERE cycle_id = ${cycleId}
    `;
  }

  async getCyclePositions(cycleId: string): Promise<CyclePositionInfo[]> {
    const rows = await this.sql<
      { id: number; position_id: number; is_open: boolean; openings: number }[]
    >`
      SELECT id, position_id, is_open, openings
      FROM hiring.application_positions_available
      WHERE cycle_id = ${cycleId}
    `;
    return rows.map((row) => ({
      id: row.id,
      positionId: row.position_id,
      isOpen: row.is_open,
      openings: row.openings,
    }));
  }

  /** Save the roster draft and hiring picks before the lock. */
  async saveDraft(
    cycleId: string,
    draft: LeadershipDraft,
    positions: ApplyRosterInput["positions"]
  ): Promise<boolean> {
    return this.sql.begin(async (sql) => {
      const [cycle] = await sql<{ id: string }[]>`
        UPDATE hiring.cycles
        SET leadership_draft = ${sql.json(draft)}
        WHERE id = ${cycleId} AND roster_locked_at IS NULL
        RETURNING id
      `;
      if (!cycle) return false;
      await this.syncPositions(sql, cycleId, positions);
      return true;
    });
  }

  /**
   * Apply the roster in one transaction: roster rows, role changes, open positions,
   * the saved draft and an audit event. Returns false if the lock lost a race
   * (already locked) or the cycle is gone.
   */
  async applyRoster(input: ApplyRosterInput): Promise<boolean> {
    const { cycleId, actorId, draft, roster, changes, lock, positions } = input;

    return this.sql.begin(async (sql) => {
      const [cycle] = lock
        ? await sql<{ id: string }[]>`
            UPDATE hiring.cycles
            SET roster_locked_at = now(), phase = 'setup', leadership_draft = ${sql.json(draft)}
            WHERE id = ${cycleId} AND roster_locked_at IS NULL
            RETURNING id
          `
        : await sql<{ id: string }[]>`
            UPDATE hiring.cycles
            SET leadership_draft = ${sql.json(draft)}
            WHERE id = ${cycleId} AND roster_locked_at IS NOT NULL
            RETURNING id
          `;
      if (!cycle) return false;

      const rosterIds = roster.map((entry) => entry.profileId);
      await sql`
        DELETE FROM hiring.cycle_leadership
        WHERE cycle_id = ${cycleId}
          AND NOT (profile_id = ANY(${sql.array(rosterIds)}::uuid[]))
      `;

      // Insert roster rows before changing roles so prior_role captures the old role.
      for (const entry of roster) {
        await sql`
          INSERT INTO hiring.cycle_leadership (
            cycle_id, profile_id, role, position_id, subteam_id, kind,
            confirmed_by, prior_role, prior_subteam_id
          )
          SELECT
            ${cycleId}, ${entry.profileId}, ${entry.role}, ${entry.positionId},
            ${entry.subteamId}, ${entry.kind}, ${actorId}, ur.role, ur.subteam_id
          FROM public.user_roles ur
          WHERE ur.id = ${entry.profileId}
          ON CONFLICT (cycle_id, profile_id) DO UPDATE SET
            role = EXCLUDED.role,
            position_id = EXCLUDED.position_id,
            subteam_id = EXCLUDED.subteam_id,
            kind = EXCLUDED.kind,
            confirmed_by = EXCLUDED.confirmed_by,
            confirmed_at = now()
        `;
      }

      for (const change of changes) {
        await sql`
          UPDATE public.user_roles
          SET role = ${change.to.role}, subteam_id = ${change.to.subteamId}
          WHERE id = ${change.profileId}
        `;
      }

      await this.syncPositions(sql, cycleId, positions);

      const type: CycleEventType = lock ? "leadership_locked" : "leadership_edited";
      await sql`
        INSERT INTO hiring.cycle_events (cycle_id, actor_id, type, payload)
        VALUES (
          ${cycleId},
          ${actorId},
          ${type},
          ${sql.json({
            changes: changes.map((change) => ({
              profile_id: change.profileId,
              from_role: change.from.role,
              from_subteam_id: change.from.subteamId,
              to_role: change.to.role,
              to_subteam_id: change.to.subteamId,
            })),
            roster: roster.map((entry) => ({
              profile_id: entry.profileId,
              role: entry.role,
              position_id: entry.positionId,
              kind: entry.kind,
            })),
          })}
        )
      `;
      return true;
    });
  }

  /**
   * Make the cycle's rows for `managedIds` match `desired`: upsert the desired ones as
   * open, delete the rest (or close them if applicants already picked them).
   */
  private async syncPositions(
    sql: TransactionSql,
    cycleId: string,
    { managedIds, desired }: ApplyRosterInput["positions"]
  ): Promise<void> {
    for (const pick of desired) {
      await sql`
        INSERT INTO hiring.application_positions_available (cycle_id, position_id, is_open, openings)
        VALUES (${cycleId}, ${pick.positionId}, true, ${pick.openings})
        ON CONFLICT (cycle_id, position_id) DO UPDATE SET
          is_open = true,
          openings = EXCLUDED.openings
      `;
    }

    const keep = desired.map((pick) => pick.positionId);
    await sql`
      DELETE FROM hiring.application_positions_available apa
      WHERE apa.cycle_id = ${cycleId}
        AND apa.position_id = ANY(${sql.array(managedIds)}::int[])
        AND NOT (apa.position_id = ANY(${sql.array(keep)}::int[]))
        AND NOT EXISTS (
          SELECT 1 FROM hiring.application_position_selections s WHERE s.position_id = apa.id
        )
    `;
    await sql`
      UPDATE hiring.application_positions_available
      SET is_open = false
      WHERE cycle_id = ${cycleId}
        AND position_id = ANY(${sql.array(managedIds)}::int[])
        AND NOT (position_id = ANY(${sql.array(keep)}::int[]))
    `;
  }
}
