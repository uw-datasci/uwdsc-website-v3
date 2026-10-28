import {
  explainTransition,
  type RecruitingActor,
  type RecruitingActorRole,
  type SelectionStatus,
} from "@uwdsc/common/recruiting";
import type { OfferLinkResponseInput } from "@uwdsc/common/schemas";
import { ApiError, type PublicOfferView } from "@uwdsc/common/types";
import { firstName, formatTermCode, joinNames } from "@uwdsc/common/utils";
import { offerLinkState, type OfferLinkRow } from "./offerLink";
import {
  OfferResponseRepository,
  type CardMove,
  type OfferResponse,
  type OfferResponseVia,
  type VpHire,
} from "./offerResponse.repository";
import { hashOfferToken } from "./offerToken";

const CLOSED_REASONS: Record<Exclude<PublicOfferView["state"], "open">, string> = {
  accepted: "You've already accepted this offer",
  declined: "You've already answered this offer",
  expired: "This offer has expired",
  closed: "This offer is no longer open",
};

export interface ApplyResponseInput {
  selectionId: string;
  response: OfferResponse;
  via: OfferResponseVia;
  actorId: string;
  actorRole: RecruitingActorRole;
  note?: string | null;
  cycleId?: string;
}

function assertMove(from: SelectionStatus, to: SelectionStatus, actor: RecruitingActor): void {
  const check = explainTransition(from, to, actor);
  if (!check.ok) throw new ApiError(check.reason, 400);
}

class OfferResponseService {
  private readonly repository = new OfferResponseRepository();

  /**
   * Accept or decline one card (by link, by hand, or as a correction). Accepting declines
   * the candidate's other open offers and, for a public VP seat, grants admin.
   */
  async apply(input: ApplyResponseInput): Promise<void> {
    const cards = await this.repository.getCards(input.selectionId);
    const row = cards.find((card) => card.selection_id === input.selectionId);
    if (!row || (input.cycleId && row.cycle_id !== input.cycleId)) {
      throw new ApiError("Card not found in this cycle", 404);
    }

    const accepted = input.response === "accepted";
    const to: SelectionStatus = accepted ? "Accepted Offer" : "Declined Offer";
    let action: RecruitingActor["action"] = "correction";
    if (input.actorRole === "candidate") action = "offer_response";
    else if (row.status === "Offer Sent") action = "manual_response";
    assertMove(row.status, to, { role: input.actorRole, action });

    const siblings = cards.filter((card) => card.selection_id !== row.selection_id);
    const siblingMoves: CardMove[] = [];
    if (accepted) {
      if (siblings.some((card) => card.status === "Accepted Offer")) {
        throw new ApiError("Another offer has already been accepted", 409);
      }
      for (const other of siblings.filter((card) => card.status === "Offer Sent")) {
        assertMove(other.status, "Declined Offer", {
          role: "system",
          action: "sibling_accepted",
        });
        siblingMoves.push({
          selectionId: other.selection_id,
          from: other.status,
          to: "Declined Offer",
          actorId: null,
          reason: "accepted another offer",
        });
      }
    }

    let vpHire: VpHire | null = null;
    if (accepted && row.is_vp) {
      if (row.subteam_id === null) throw new ApiError("This VP seat has no subteam", 400);
      if (await this.repository.isOnRoster(row.cycle_id, row.profile_id)) {
        throw new ApiError("Already on next term's leadership", 409);
      }
      vpHire = {
        cycleId: row.cycle_id,
        profileId: row.profile_id,
        positionId: row.position_id,
        subteamId: row.subteam_id,
        actorId: input.actorId,
      };
    }
    const vpUndo =
      !accepted && row.is_vp && row.status === "Accepted Offer"
        ? { cycleId: row.cycle_id, profileId: row.profile_id, positionId: row.position_id }
        : null;

    await this.repository.recordResponse({
      move: {
        selectionId: row.selection_id,
        from: row.status,
        to,
        actorId: input.actorId,
        reason: input.via === "link" ? "via link" : null,
      },
      response: input.response,
      via: input.via,
      note: input.note?.trim() || null,
      siblings: siblingMoves,
      vpHire,
      vpUndo,
    });
  }

  /** The public offer page for a link, or null if the token doesn't match an offer. */
  async getByToken(token: string): Promise<PublicOfferView | null> {
    const row = await this.repository.getByTokenHash(hashOfferToken(token));
    return row ? this.toView(row) : null;
  }

  /** The candidate accepts or declines from the link. */
  async respondByToken(token: string, input: OfferLinkResponseInput): Promise<PublicOfferView> {
    const hash = hashOfferToken(token);
    const row = await this.repository.getByTokenHash(hash);
    if (!row) throw new ApiError("This link isn't valid", 404);

    const state = offerLinkState(row);
    if (state !== "open") throw new ApiError(CLOSED_REASONS[state], 410);

    await this.apply({
      selectionId: row.selection_id,
      response: input.response,
      via: "link",
      actorId: row.profile_id,
      actorRole: "candidate",
      note: input.response === "declined" ? input.note : null,
      cycleId: row.cycle_id,
    });

    const updated = await this.repository.getByTokenHash(hash);
    if (!updated) throw new ApiError("This link isn't valid", 404);
    return this.toView(updated);
  }

  private async toView(row: OfferLinkRow): Promise<PublicOfferView> {
    const presidents = await this.repository.getPresidentNames(row.cycle_id);
    return {
      state: offerLinkState(row),
      firstName: firstName(row.full_name),
      positionName: row.position_name,
      subteamName: row.subteam_name,
      termLabel: formatTermCode(row.target_term_code),
      expiresAt: new Date(row.expires_at).toISOString(),
      respondedAt: row.responded_at ? new Date(row.responded_at).toISOString() : null,
      personalLine: row.personal_line,
      signedBy: joinNames(presidents) || "The DSC presidents",
      acceptedElsewhere: row.accepted_elsewhere,
    };
  }
}

export const offerResponseService = new OfferResponseService();
