import {
  explainTransition,
  type RecruitingActor,
  type RecruitingActorRole,
  type SelectionStatus,
} from "@uwdsc/common/recruiting";
import { ApiError } from "@uwdsc/common/types";
import {
  OfferResponseRepository,
  type CardMove,
  type OfferResponse,
  type OfferResponseVia,
  type VpHire,
} from "./offerResponse.repository";

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
}

export const offerResponseService = new OfferResponseService();
