import { BaseRepository } from "@uwdsc/db/base.repository";
import { applyCardMove, type CardMove } from "@uwdsc/core";
import { ApiError, type ApplicationReviewStatus, type UserRole } from "@uwdsc/common/types";

export interface OfferCardRow {
  selection_id: string;
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
  openings: number;
  sent_at: string | null;
  expires_at: string | null;
  responded_at: string | null;
  wanted_by: string | null;
  wanted_at: string | null;
}

export interface PresidentRow {
  name: string | null;
  email: string | null;
}

export class OffersRepository extends BaseRepository {
  /** Every submitted card in the cycle, with its live offer and who marked it Wanted. */
  async getCards(cycleId: string, termId: string): Promise<OfferCardRow[]> {
    return this.sql<OfferCardRow[]>`
      SELECT
        s.id AS selection_id,
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
        apa.openings,
        o.sent_at,
        o.expires_at,
        o.responded_at,
        w.wanted_by,
        w.created_at AS wanted_at
      FROM hiring.application_position_selections s
      JOIN hiring.applications a ON a.id = s.application_id
      JOIN hiring.application_positions_available apa ON apa.id = s.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      LEFT JOIN auth.users au ON au.id = a.profile_id
      LEFT JOIN LATERAL (
        SELECT o.sent_at, o.expires_at, o.responded_at
        FROM hiring.offers o
        WHERE o.selection_id = s.id AND o.withdrawn_at IS NULL
        ORDER BY o.sent_at DESC
        LIMIT 1
      ) o ON true
      LEFT JOIN LATERAL (
        SELECT
          se.created_at,
          COALESCE(NULLIF(btrim(concat_ws(' ', p.first_name, p.last_name)), ''), pu.email)
            AS wanted_by
        FROM hiring.selection_events se
        LEFT JOIN public.profiles p ON p.id = se.actor_id
        LEFT JOIN auth.users pu ON pu.id = se.actor_id
        WHERE se.selection_id = s.id AND se.to_status = 'Wanted'
        ORDER BY se.created_at DESC
        LIMIT 1
      ) w ON true
      WHERE apa.cycle_id = ${cycleId}
        AND a.term_id = ${termId}
        AND a.status <> 'draft'
      ORDER BY a.full_name, s.priority
    `;
  }

  /** Next term's presidents: they sign the emails and get the replies. */
  async getPresidents(cycleId: string): Promise<PresidentRow[]> {
    return this.sql<PresidentRow[]>`
      SELECT
        NULLIF(btrim(concat_ws(' ', p.first_name, p.last_name)), '') AS name,
        au.email
      FROM hiring.cycle_leadership cl
      JOIN public.profiles p ON p.id = cl.profile_id
      LEFT JOIN auth.users au ON au.id = cl.profile_id
      WHERE cl.cycle_id = ${cycleId} AND cl.role = 'pres'
      ORDER BY cl.confirmed_at, p.first_name
    `;
  }

  /**
   * Move the card to Offer Sent, open the offer, then run `send` (the email) before
   * committing, so a failed send leaves nothing behind.
   */
  async sendOffer(input: {
    selectionId: string;
    actorId: string;
    sentAt: Date;
    expiresAt: Date;
    tokenHash: string;
    personalLine: string | null;
    send: () => Promise<string | null>;
  }): Promise<void> {
    await this.sql.begin(async (sql) => {
      await applyCardMove(sql, {
        selectionId: input.selectionId,
        from: "Wanted",
        to: "Offer Sent",
        actorId: input.actorId,
        reason: null,
      });
      const [offer] = await sql<{ id: string }[]>`
        INSERT INTO hiring.offers
          (selection_id, sent_at, expires_at, sent_by, token_hash, personal_line)
        VALUES
          (${input.selectionId}, ${input.sentAt}, ${input.expiresAt}, ${input.actorId},
           ${input.tokenHash}, ${input.personalLine})
        RETURNING id
      `;
      if (!offer) throw new ApiError("Couldn't create the offer", 500);
      const emailId = await input.send();
      await sql`UPDATE hiring.offers SET email_id = ${emailId} WHERE id = ${offer.id}`;
    });
  }

  /** Move cards to Rejection Sent and run `send` (the emails) before committing. */
  async sendRejections(moves: CardMove[], send: () => Promise<void>): Promise<void> {
    await this.sql.begin(async (sql) => {
      for (const move of moves) await applyCardMove(sql, move);
      await send();
    });
  }
}
