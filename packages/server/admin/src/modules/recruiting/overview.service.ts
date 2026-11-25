import {
  buildOverview,
  type RecruitingCapabilities,
  type RecruitingCycleSummary,
} from "@uwdsc/common/recruiting";
import type { OverviewView } from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { BoardRepository } from "./board.repository";
import { OverviewRepository } from "./overview.repository";
import { SetupRepository } from "./setup.repository";

type Capabilities = Pick<RecruitingCapabilities, "viewer" | "cycle">;

class OverviewService {
  private readonly repository = new OverviewRepository();
  private readonly board = new BoardRepository();
  private readonly setup = new SetupRepository();

  async getOverview(caps: Capabilities): Promise<OverviewView> {
    const cycle = this.requireCycle(caps);
    const [cards, positions, schedule] = await Promise.all([
      this.board.getCards(cycle.id, cycle.termId),
      this.repository.getPositions(cycle.id),
      this.setup.getSchedule(cycle.id),
    ]);

    return buildOverview({
      viewer: caps.viewer,
      cycle,
      schedule: {
        releaseDate: schedule?.releaseDate ?? null,
        hardDeadline: schedule?.hardDeadline ?? null,
      },
      cards: cards.map((row) => ({
        selectionId: row.id,
        applicationId: row.application_id,
        name: row.full_name,
        status: row.status,
        positionId: row.position_id,
        positionName: row.position_name,
        subteamId: row.subteam_id,
        subteamName: row.subteam_name,
        isVp: row.is_vp,
        noteCount: row.note_count,
        offerExpiresAt: row.offer_expires_at,
      })),
      positions: positions.map((row) => ({
        positionId: row.position_id,
        name: row.name,
        subteamId: row.subteam_id,
        subteamName: row.subteam_name,
        isVp: row.is_vp,
        isOpen: row.is_open,
        openings: row.openings,
        questionCount: row.question_count,
      })),
    });
  }

  private requireCycle(caps: Capabilities): RecruitingCycleSummary {
    if (!caps.cycle) throw new ApiError("There's no hiring cycle yet", 404);
    return caps.cycle;
  }
}

export const overviewService = new OverviewService();
