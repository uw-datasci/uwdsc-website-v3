import {
  canMoveCard,
  explainTransition,
  type RecruitingCapabilities,
  type RecruitingCycleSummary,
} from "@uwdsc/common/recruiting";
import type { MoveCardInput } from "@uwdsc/common/schemas";
import type { BoardCard, BoardView } from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { BoardRepository } from "./board.repository";

type Capabilities = Pick<RecruitingCapabilities, "can" | "viewer" | "cycle">;

class BoardService {
  private readonly repository = new BoardRepository();

  async getBoard(caps: Capabilities): Promise<BoardView> {
    const cycle = this.requireCycle(caps);
    try {
      const [rows, positionRows] = await Promise.all([
        this.repository.getCards(cycle.id, cycle.termId),
        this.repository.getPositions(cycle.id),
      ]);

      const cards: BoardCard[] = rows.map((row) => ({
        id: row.id,
        applicationId: row.application_id,
        profileId: row.profile_id,
        name: row.full_name,
        email: row.email,
        program: row.major,
        year: row.year_of_study,
        priority: row.priority,
        status: row.status,
        positionId: row.position_id,
        positionName: row.position_name,
        subteamId: row.subteam_id,
        subteamName: row.subteam_name,
        isVp: row.is_vp,
        noteCount: row.note_count,
        returning: row.applicant_role === "exec" || row.applicant_role === "alum",
        canMove: canMoveCard(caps, { subteamId: row.subteam_id, isVp: row.is_vp }),
      }));

      const subteams = new Map<number, string>();
      for (const row of positionRows) {
        if (row.subteam_id !== null && row.subteam_name) {
          subteams.set(row.subteam_id, row.subteam_name);
        }
      }

      return {
        cards,
        positions: positionRows.map((row) => ({
          id: row.id,
          name: row.name,
          subteamId: row.subteam_id,
          subteamName: row.subteam_name,
          isVp: row.is_vp,
        })),
        subteams: [...subteams].map(([id, name]) => ({ id, name })),
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to load the board: ${(error as Error).message}`, 500);
    }
  }

  /** Drag a card between review columns (also used by the drawer's status control). */
  async move(
    caps: Capabilities,
    actorId: string,
    selectionId: string,
    input: MoveCardInput
  ): Promise<void> {
    const cycle = this.requireCycle(caps);
    const selection = await this.repository.getSelection(cycle.id, cycle.termId, selectionId);
    if (!selection) throw new ApiError("Card not found in this cycle", 404);

    if (!canMoveCard(caps, { subteamId: selection.subteam_id, isVp: selection.is_vp })) {
      throw new ApiError(
        selection.is_vp
          ? "Only presidents can move applicants for VP roles"
          : "VPs can only move their own subteam's candidates",
        403
      );
    }

    if (selection.status !== input.from) {
      throw new ApiError("This card changed since you loaded it", 409);
    }

    const check = explainTransition(input.from, input.to, {
      role: caps.viewer.role,
      action: "drag",
    });
    if (!check.ok) throw new ApiError(check.reason, 400);

    const moved = await this.repository.moveSelection(
      selectionId,
      input.from,
      input.to,
      actorId,
      input.undo ? "undo" : null
    );
    if (!moved) throw new ApiError("This card changed since you loaded it", 409);
  }

  private requireCycle(caps: Capabilities): RecruitingCycleSummary {
    if (!caps.cycle) throw new ApiError("There's no hiring cycle yet", 404);
    return caps.cycle;
  }
}

export const boardService = new BoardService();
