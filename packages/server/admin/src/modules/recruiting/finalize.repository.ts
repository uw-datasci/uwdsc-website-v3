import { BaseRepository } from "@uwdsc/db/base.repository";
import type { UserRole } from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import type { FinalizePlan } from "@uwdsc/common/recruiting";

export interface CurrentTeamRow {
  profile_id: string;
  name: string;
  position_name: string;
  subteam_name: string | null;
  is_vp: boolean;
  is_president: boolean;
}

export interface RosterRow {
  profile_id: string;
  name: string;
  email: string | null;
  role: Extract<UserRole, "pres" | "admin">;
  position_id: number;
  subteam_id: number;
  subteam_name: string | null;
}

export interface DecidedRow {
  selection_id: string;
  profile_id: string;
  name: string;
  email: string | null;
  status: "Accepted Offer" | "Offer Sent";
  position_id: number;
  position_name: string;
  subteam_id: number | null;
  subteam_name: string | null;
  is_vp: boolean;
  expires_at: string | null;
}

export class FinalizeRepository extends BaseRepository {
  /** Today's team: exec_team rows for `org.team_term_id()`. */
  async getCurrentTeam(): Promise<CurrentTeamRow[]> {
    return this.sql<CurrentTeamRow[]>`
      SELECT
        et.profile_id,
        COALESCE(NULLIF(btrim(concat_ws(' ', p.first_name, p.last_name)), ''), au.email, 'Unnamed') AS name,
        ep.name AS position_name,
        st.name AS subteam_name,
        ep.is_vp,
        (st.name = 'Presidents') AS is_president
      FROM org.exec_team et
      JOIN public.profiles p ON p.id = et.profile_id
      LEFT JOIN auth.users au ON au.id = et.profile_id
      JOIN org.exec_positions ep ON ep.id = et.position_id
      LEFT JOIN org.subteams st ON st.id = et.subteam_id
      WHERE et.term_id = org.team_term_id()
      ORDER BY st.id NULLS LAST, ep.is_vp DESC, name
    `;
  }

  async getRoster(cycleId: string): Promise<RosterRow[]> {
    return this.sql<RosterRow[]>`
      SELECT
        cl.profile_id,
        COALESCE(NULLIF(btrim(concat_ws(' ', p.first_name, p.last_name)), ''), au.email, 'Unnamed') AS name,
        au.email,
        cl.role,
        cl.position_id,
        cl.subteam_id,
        st.name AS subteam_name
      FROM hiring.cycle_leadership cl
      JOIN public.profiles p ON p.id = cl.profile_id
      LEFT JOIN auth.users au ON au.id = cl.profile_id
      LEFT JOIN org.subteams st ON st.id = cl.subteam_id
      WHERE cl.cycle_id = ${cycleId}
      ORDER BY cl.role DESC, st.name, name
    `;
  }

  /** Accepted and still-open offers in the cycle. */
  async getDecided(cycleId: string, termId: string): Promise<DecidedRow[]> {
    return this.sql<DecidedRow[]>`
      SELECT
        s.id AS selection_id,
        a.profile_id,
        a.full_name AS name,
        au.email,
        s.status,
        ep.id AS position_id,
        ep.name AS position_name,
        ep.subteam_id,
        st.name AS subteam_name,
        ep.is_vp,
        o.expires_at
      FROM hiring.application_position_selections s
      JOIN hiring.applications a ON a.id = s.application_id
      JOIN hiring.application_positions_available apa ON apa.id = s.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      LEFT JOIN auth.users au ON au.id = a.profile_id
      LEFT JOIN hiring.offers o
        ON o.selection_id = s.id AND o.withdrawn_at IS NULL AND o.response IS NULL
      WHERE apa.cycle_id = ${cycleId}
        AND a.term_id = ${termId}
        AND s.status IN ('Accepted Offer', 'Offer Sent')
      ORDER BY st.name NULLS FIRST, ep.name, a.full_name
    `;
  }

  async getExecHolders(): Promise<{ profile_id: string; name: string }[]> {
    return this.sql<{ profile_id: string; name: string }[]>`
      SELECT ur.id AS profile_id, COALESCE(NULLIF(btrim(concat_ws(' ', p.first_name, p.last_name)), ''), au.email, 'Unnamed') AS name
      FROM public.user_roles ur
      JOIN public.profiles p ON p.id = ur.id
      LEFT JOIN auth.users au ON au.id = ur.id
      WHERE ur.role = 'exec'
      ORDER BY name
    `;
  }

  /** Openings across the cycle's open exec (non-VP) positions. */
  async getSeatsTotal(cycleId: string): Promise<number> {
    const [row] = await this.sql<{ total: number }[]>`
      SELECT COALESCE(SUM(apa.openings), 0)::int AS total
      FROM hiring.application_positions_available apa
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      WHERE apa.cycle_id = ${cycleId} AND apa.is_open AND NOT ep.is_vp
    `;
    return row?.total ?? 0;
  }

  /**
   * The Finalize transaction: mark the cycle finalized (once), close open offers, apply
   * roles and write next term's exec_team rows with photo/Instagram carried over.
   */
  async finalize(input: {
    cycleId: string;
    targetTermId: string;
    actorId: string;
    plan: FinalizePlan;
  }): Promise<void> {
    const { cycleId, targetTermId, actorId, plan } = input;

    await this.sql.begin(async (sql) => {
      const guard = await sql`
        UPDATE hiring.cycles
        SET finalized_at = now(), finalized_by = ${actorId}, phase = 'finalized'
        WHERE id = ${cycleId} AND finalized_at IS NULL
        RETURNING id
      `;
      if (guard.length === 0) throw new ApiError("This cycle is already finalized", 409);

      for (const offer of plan.pending) {
        const moved = await sql`
          UPDATE hiring.application_position_selections
          SET status = 'Declined Offer'
          WHERE id = ${offer.selectionId} AND status = 'Offer Sent'
          RETURNING id
        `;
        if (moved.length === 0) throw new ApiError("An offer changed while finalizing", 409);
        await sql`
          UPDATE hiring.offers
          SET withdrawn_at = now()
          WHERE selection_id = ${offer.selectionId} AND withdrawn_at IS NULL
        `;
        await sql`
          INSERT INTO hiring.selection_events (selection_id, actor_id, from_status, to_status, reason)
          VALUES (${offer.selectionId}, ${actorId}, 'Offer Sent', 'Declined Offer', 'closed at finalize')
        `;
      }

      for (const update of plan.roleUpdates) {
        await sql`
          UPDATE public.user_roles
          SET role = ${update.role}, subteam_id = ${update.subteamId}
          WHERE id = ${update.profileId}
        `;
      }

      for (const row of plan.teamRows) {
        await sql`
          INSERT INTO org.exec_team (profile_id, position_id, subteam_id, term_id, photo_url, instagram)
          SELECT ${row.profileId}, ${row.positionId}, ${row.subteamId}, ${targetTermId},
                 prev.photo_url, prev.instagram
          FROM (SELECT 1) one
          LEFT JOIN LATERAL (
            SELECT et.photo_url, et.instagram
            FROM org.exec_team et
            JOIN public.terms t ON t.id = et.term_id
            WHERE et.profile_id = ${row.profileId} AND et.term_id <> ${targetTermId}
            ORDER BY t.start_date DESC
            LIMIT 1
          ) prev ON true
          ON CONFLICT (profile_id, term_id) DO UPDATE
            SET position_id = EXCLUDED.position_id,
                subteam_id = EXCLUDED.subteam_id,
                updated_at = now()
        `;
      }

      await sql`
        INSERT INTO hiring.cycle_events (cycle_id, actor_id, type, payload)
        VALUES (${cycleId}, ${actorId}, 'finalized', ${sql.json({
          team: plan.teamRows.length,
          execs: plan.roleUpdates.filter((u) => u.role === "exec").length,
          alumni: plan.roleUpdates.filter((u) => u.role === "alum").length,
          closedOffers: plan.pending.length,
        })})
      `;
    });
  }
}
