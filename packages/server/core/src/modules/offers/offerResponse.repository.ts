import { BaseRepository } from "@uwdsc/db/base.repository";
import type { TransactionSql } from "@uwdsc/db/connection";
import {
  fillPublicSeat,
  publicVpSeats,
  reopenPublicSeat,
  restoreRoleAfterRemoval,
} from "@uwdsc/common/recruiting";
import { leadershipDraftSchema, type LeadershipDraft } from "@uwdsc/common/schemas";
import { ApiError, type ApplicationReviewStatus, type UserRole } from "@uwdsc/common/types";
import type { OfferLinkRow } from "./offerLink";

export type OfferResponse = "accepted" | "declined";
export type OfferResponseVia = "link" | "manual";

/** A status change inside an offer transaction. */
export interface CardMove {
  selectionId: string;
  from: ApplicationReviewStatus;
  to: ApplicationReviewStatus;
  actorId: string | null;
  reason: string | null;
}

/** Accepting a public VP seat grants admin right away. */
export interface VpHire {
  cycleId: string;
  profileId: string;
  positionId: number;
  subteamId: number;
  actorId: string;
}

export interface VpUndo {
  cycleId: string;
  profileId: string;
  positionId: number;
  subteamId: number | null;
  actorId: string;
}

export interface ResponseCardRow {
  selection_id: string;
  application_id: string;
  profile_id: string;
  status: ApplicationReviewStatus;
  position_id: number;
  is_vp: boolean;
  subteam_id: number | null;
  cycle_id: string;
}

/** Guarded status change plus its selection_events row. Throws 409 if the card moved. */
export async function applyCardMove(sql: TransactionSql, move: CardMove): Promise<void> {
  const updated = await sql`
    UPDATE hiring.application_position_selections
    SET status = ${move.to}
    WHERE id = ${move.selectionId} AND status = ${move.from}
    RETURNING id
  `;
  if (updated.length === 0) throw new ApiError("This card changed since you loaded it", 409);

  await sql`
    INSERT INTO hiring.selection_events (selection_id, actor_id, from_status, to_status, reason)
    VALUES (${move.selectionId}, ${move.actorId}, ${move.from}, ${move.to}, ${move.reason})
  `;
}

export class OfferResponseRepository extends BaseRepository {
  /** The card and every other card on the same application. */
  async getCards(selectionId: string): Promise<ResponseCardRow[]> {
    return this.sql<ResponseCardRow[]>`
      SELECT
        s.id AS selection_id,
        s.application_id,
        a.profile_id,
        s.status,
        ep.id AS position_id,
        ep.is_vp,
        ep.subteam_id,
        apa.cycle_id
      FROM hiring.application_position_selections target
      JOIN hiring.application_position_selections s ON s.application_id = target.application_id
      JOIN hiring.applications a ON a.id = s.application_id
      JOIN hiring.application_positions_available apa ON apa.id = s.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      WHERE target.id = ${selectionId}
    `;
  }

  async isOnRoster(cycleId: string, profileId: string): Promise<boolean> {
    const rows = await this.sql`
      SELECT 1 FROM hiring.cycle_leadership
      WHERE cycle_id = ${cycleId} AND profile_id = ${profileId}
    `;
    return rows.length > 0;
  }

  async getByTokenHash(tokenHash: string): Promise<OfferLinkRow | null> {
    const [row] = await this.sql<OfferLinkRow[]>`
      SELECT
        o.id AS offer_id,
        o.selection_id,
        a.profile_id,
        apa.cycle_id,
        s.status,
        a.full_name,
        ep.name AS position_name,
        st.name AS subteam_name,
        t.code AS target_term_code,
        o.expires_at,
        o.responded_at,
        o.response,
        o.withdrawn_at,
        o.personal_line,
        (
          SELECT ep2.name
          FROM hiring.application_position_selections s2
          JOIN hiring.application_positions_available apa2 ON apa2.id = s2.position_id
          JOIN org.exec_positions ep2 ON ep2.id = apa2.position_id
          WHERE s2.application_id = s.application_id
            AND s2.id <> s.id
            AND s2.status = 'Accepted Offer'
          LIMIT 1
        ) AS accepted_elsewhere
      FROM hiring.offers o
      JOIN hiring.application_position_selections s ON s.id = o.selection_id
      JOIN hiring.applications a ON a.id = s.application_id
      JOIN hiring.application_positions_available apa ON apa.id = s.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      JOIN hiring.cycles c ON c.id = apa.cycle_id
      JOIN public.terms t ON t.id = c.target_term_id
      WHERE o.token_hash = ${tokenHash}
    `;
    return row ?? null;
  }

  /** Next term's presidents, who sign the offer. */
  async getPresidentNames(cycleId: string): Promise<string[]> {
    const rows = await this.sql<{ name: string | null }[]>`
      SELECT NULLIF(btrim(concat_ws(' ', p.first_name, p.last_name)), '') AS name
      FROM hiring.cycle_leadership cl
      JOIN public.profiles p ON p.id = cl.profile_id
      WHERE cl.cycle_id = ${cycleId} AND cl.role = 'pres'
      ORDER BY cl.confirmed_at, p.first_name
    `;
    return rows.map((row) => row.name).filter((name): name is string => !!name);
  }

  /**
   * Record a reply (or a correction) on one card, decline the candidate's other open
   * offers on accept, and grant or undo a public VP hire.
   */
  async recordResponse(input: {
    move: CardMove;
    response: OfferResponse;
    via: OfferResponseVia;
    note: string | null;
    siblings: CardMove[];
    vpHire: VpHire | null;
    vpUndo: VpUndo | null;
  }): Promise<void> {
    await this.sql.begin(async (sql) => {
      await applyCardMove(sql, input.move);
      await this.setResponse(
        sql,
        input.move.selectionId,
        input.response,
        input.via,
        input.note
      );

      for (const sibling of input.siblings) {
        await applyCardMove(sql, sibling);
        await this.setResponse(sql, sibling.selectionId, "declined", input.via, null);
      }

      if (input.vpHire) await this.grantVp(sql, input.vpHire);
      if (input.vpUndo) await this.undoVp(sql, input.vpUndo);
    });
  }

  private async setResponse(
    sql: TransactionSql,
    selectionId: string,
    response: OfferResponse,
    via: OfferResponseVia,
    note: string | null
  ): Promise<void> {
    await sql`
      UPDATE hiring.offers
      SET response = ${response}, responded_at = now(), responded_via = ${via},
          response_note = ${note}
      WHERE selection_id = ${selectionId} AND withdrawn_at IS NULL
    `;
  }

  /**
   * Accepting a public VP seat: lock the seat to the hire in the leadership draft (so a
   * later Leadership edit keeps them), add them to the roster, grant admin, and close the
   * position once none of its seats are open.
   */
  private async grantVp(sql: TransactionSql, hire: VpHire): Promise<void> {
    const draft = await this.lockDraft(sql, hire.cycleId);
    const filled = draft && fillPublicSeat(draft, hire.positionId, hire.profileId);
    if (!filled) throw new ApiError("This VP seat is no longer open to the public", 409);
    await this.saveDraft(sql, hire.cycleId, hire.positionId, filled);

    const [current] = await sql<{ role: UserRole; subteam_id: number | null }[]>`
      SELECT role, subteam_id FROM public.user_roles WHERE id = ${hire.profileId}
    `;
    await sql`
      INSERT INTO hiring.cycle_leadership
        (cycle_id, profile_id, role, position_id, subteam_id, kind, confirmed_by,
         prior_role, prior_subteam_id)
      VALUES
        (${hire.cycleId}, ${hire.profileId}, 'admin', ${hire.positionId}, ${hire.subteamId},
         'public_hire', ${hire.actorId}, ${current?.role ?? null}, ${current?.subteam_id ?? null})
    `;
    await sql`
      UPDATE public.user_roles
      SET role = 'admin', subteam_id = ${hire.subteamId}
      WHERE id = ${hire.profileId}
    `;
    await this.logLeadershipEdit(sql, hire.cycleId, hire.actorId, {
      profileId: hire.profileId,
      from: { role: current?.role ?? null, subteamId: current?.subteam_id ?? null },
      to: { role: "admin", subteamId: hire.subteamId },
      positionId: hire.positionId,
      kind: "public_hire",
    });
  }

  /** The accepted public VP offer was corrected to Declined: reopen the seat, restore the role. */
  private async undoVp(sql: TransactionSql, undo: VpUndo): Promise<void> {
    const draft = await this.lockDraft(sql, undo.cycleId);
    const reopened = draft && reopenPublicSeat(draft, undo.positionId, undo.profileId);
    if (reopened) await this.saveDraft(sql, undo.cycleId, undo.positionId, reopened);

    const [row] = await sql<{ prior_role: UserRole | null; prior_subteam_id: number | null }[]>`
      DELETE FROM hiring.cycle_leadership
      WHERE cycle_id = ${undo.cycleId}
        AND profile_id = ${undo.profileId}
        AND position_id = ${undo.positionId}
        AND kind = 'public_hire'
      RETURNING prior_role, prior_subteam_id
    `;
    if (!row) return;
    const restored = restoreRoleAfterRemoval(row.prior_role, row.prior_subteam_id);
    await sql`
      UPDATE public.user_roles
      SET role = ${restored.role}, subteam_id = ${restored.subteamId}
      WHERE id = ${undo.profileId}
    `;
    await this.logLeadershipEdit(sql, undo.cycleId, undo.actorId, {
      profileId: undo.profileId,
      from: { role: "admin", subteamId: undo.subteamId },
      to: restored,
      positionId: undo.positionId,
      kind: null,
    });
  }

  /** The cycle's leadership draft, row-locked so Leadership saves and hires serialize. */
  private async lockDraft(
    sql: TransactionSql,
    cycleId: string
  ): Promise<LeadershipDraft | null> {
    const [cycle] = await sql<{ leadership_draft: unknown }[]>`
      SELECT leadership_draft FROM hiring.cycles WHERE id = ${cycleId} FOR UPDATE
    `;
    const parsed = leadershipDraftSchema.safeParse(cycle?.leadership_draft);
    return parsed.success ? parsed.data : null;
  }

  /** Store the draft and open the VP position only while one of its seats is still open. */
  private async saveDraft(
    sql: TransactionSql,
    cycleId: string,
    positionId: number,
    draft: LeadershipDraft
  ): Promise<void> {
    await sql`
      UPDATE hiring.cycles SET leadership_draft = ${sql.json(draft)} WHERE id = ${cycleId}
    `;
    const stillOpen = (publicVpSeats(draft).get(positionId)?.open ?? 0) > 0;
    await sql`
      UPDATE hiring.application_positions_available
      SET is_open = ${stillOpen}
      WHERE cycle_id = ${cycleId} AND position_id = ${positionId}
    `;
  }

  private async logLeadershipEdit(
    sql: TransactionSql,
    cycleId: string,
    actorId: string | null,
    change: {
      profileId: string;
      from: { role: UserRole | null; subteamId: number | null };
      to: { role: UserRole; subteamId: number | null };
      positionId: number;
      kind: "public_hire" | null;
    }
  ): Promise<void> {
    await sql`
      INSERT INTO hiring.cycle_events (cycle_id, actor_id, type, payload)
      VALUES (
        ${cycleId},
        ${actorId},
        'leadership_edited',
        ${sql.json({
          source: change.kind ? "offer_accepted" : "offer_corrected",
          changes: [
            {
              profile_id: change.profileId,
              from_role: change.from.role,
              from_subteam_id: change.from.subteamId,
              to_role: change.to.role,
              to_subteam_id: change.to.subteamId,
            },
          ],
          roster: change.kind
            ? [
                {
                  profile_id: change.profileId,
                  role: "admin",
                  position_id: change.positionId,
                  kind: change.kind,
                },
              ]
            : [],
        })}
      )
    `;
  }
}
