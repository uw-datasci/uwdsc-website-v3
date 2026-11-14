import { canEditQuestionsFor, type RecruitingCapabilities } from "@uwdsc/common/recruiting";
import type {
  CreateQuestionInput,
  ReorderQuestionsInput,
  ScheduleInput,
  UpdatePositionInput,
  UpdateQuestionInput,
} from "@uwdsc/common/schemas";
import type { SetupPosition, SetupView } from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { RecruitingRepository } from "./recruiting.repository";
import { SetupRepository, type ExecPositionRow } from "./setup.repository";

type Capabilities = Pick<RecruitingCapabilities, "can" | "viewer" | "cycle" | "locked">;

class SetupService {
  private readonly repository = new SetupRepository();
  private readonly recruiting = new RecruitingRepository();

  async getSetup(caps: Capabilities): Promise<SetupView> {
    const cycle = this.requireCycle(caps);
    try {
      const [schedule, cyclePositions, execPositions, vpSubteams, activeTerm] =
        await Promise.all([
          this.repository.getSchedule(cycle.id),
          this.repository.getCyclePositions(cycle.id),
          this.repository.getExecPositions(),
          this.repository.getVpSubteams(cycle.id),
          this.recruiting.getActiveTerm(),
        ]);
      if (!schedule) throw new ApiError("Hiring cycle not found", 404);

      const targetTerms = activeTerm
        ? await this.recruiting.getTermsStartingAfter(activeTerm.start_date)
        : [];
      const subteamsWithVp = new Set(vpSubteams.map((row) => row.subteam_id));

      const positions: SetupPosition[] = cyclePositions.map((row) => ({
        id: row.id,
        positionId: row.position_id,
        name: row.name,
        isVp: row.is_vp,
        subteamId: row.subteam_id,
        subteamName: row.subteam_name,
        isOpen: row.is_open,
        openings: row.openings,
        applicants: row.applicants,
        owner:
          row.is_vp || row.subteam_id === null || !subteamsWithVp.has(row.subteam_id)
            ? "Presidents"
            : `VP, ${row.subteam_name ?? "subteam"}`,
        canEditQuestions: canEditQuestionsFor(caps, {
          subteamId: row.subteam_id,
          isVp: row.is_vp,
        }),
      }));

      const inCycle = new Set(cyclePositions.map((row) => row.position_id));
      const addablePositions = execPositions
        .filter((p) => !p.is_vp && p.subteam_id !== null && !inCycle.has(p.id))
        .map((p) => ({ id: p.id, name: p.name, subteamName: p.subteam_name }));

      const questions = await this.repository.getQuestions(
        cyclePositions.map((row) => row.position_id)
      );

      return {
        schedule,
        targetTerms: targetTerms.map((term) => ({ id: term.id, code: term.code })),
        positions,
        addablePositions,
        questions,
        canEditSchedule: caps.can.editSchedule,
        canEditGeneralQuestions: canEditQuestionsFor(caps, null),
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to load setup: ${(error as Error).message}`, 500);
    }
  }

  async updateSchedule(caps: Capabilities, input: ScheduleInput): Promise<void> {
    const cycle = this.requireCycle(caps);
    if (!caps.can.editSchedule)
      throw new ApiError("Only presidents can change the schedule", 403);

    const activeTerm = await this.recruiting.getActiveTerm();
    const targets = activeTerm
      ? await this.recruiting.getTermsStartingAfter(activeTerm.start_date)
      : [];
    if (!targets.some((term) => term.id === input.targetTermId)) {
      throw new ApiError("The target term must start after the current term", 400);
    }

    await this.repository.updateSchedule(cycle.id, cycle.termId, input);
  }

  async addPosition(caps: Capabilities, positionId: number): Promise<void> {
    const cycle = this.requireCycle(caps);
    if (!caps.can.editSchedule) throw new ApiError("Only presidents can open positions", 403);

    const position = await this.findExecPosition(positionId);
    if (position.is_vp) {
      throw new ApiError("VP seats are opened from Leadership", 400);
    }
    await this.repository.addPosition(cycle.id, positionId);
  }

  async updatePosition(
    caps: Capabilities,
    id: number,
    patch: UpdatePositionInput
  ): Promise<void> {
    const cycle = this.requireCycle(caps);
    if (!caps.can.editSchedule) throw new ApiError("Only presidents can change positions", 403);

    const row = await this.repository.getCyclePosition(cycle.id, id);
    if (!row) throw new ApiError("Position not found in this cycle", 404);
    if (row.is_vp && patch.isOpen !== undefined) {
      throw new ApiError("Open or close VP seats from Leadership", 400);
    }
    await this.repository.updatePosition(id, patch);
  }

  async createQuestion(caps: Capabilities, input: CreateQuestionInput): Promise<void> {
    const cycle = this.requireCycle(caps);
    const { positionId, ...fields } = input;

    if (positionId !== null) {
      const positions = await this.repository.getCyclePositions(cycle.id);
      if (!positions.some((row) => row.position_id === positionId)) {
        throw new ApiError("That position isn't in this cycle", 400);
      }
    }
    await this.assertCanEdit(caps, [positionId]);
    await this.repository.createQuestion(positionId, fields);
  }

  async updateQuestion(
    caps: Capabilities,
    questionId: number,
    input: UpdateQuestionInput
  ): Promise<void> {
    this.requireCycle(caps);
    const links = await this.repository.getQuestionLinks(questionId);
    if (links.length === 0) throw new ApiError("Question not found", 404);
    await this.assertCanEdit(caps, links);

    if ("archived" in input) {
      await this.repository.setArchived(questionId, input.archived);
    } else {
      await this.repository.updateQuestion(questionId, input);
    }
  }

  async reorderQuestions(caps: Capabilities, input: ReorderQuestionsInput): Promise<void> {
    this.requireCycle(caps);
    await this.assertCanEdit(caps, [input.positionId]);
    await this.repository.reorderQuestions(input.positionId, input.questionIds);
  }

  // ---------------------------------------------------------------------------

  private requireCycle(caps: Capabilities) {
    if (!caps.cycle || caps.locked) throw new ApiError("Lock leadership first", 409);
    return caps.cycle;
  }

  private async findExecPosition(positionId: number): Promise<ExecPositionRow> {
    const positions = await this.repository.getExecPositions();
    const position = positions.find((p) => p.id === positionId);
    if (!position) throw new ApiError("Position not found", 404);
    return position;
  }

  private async assertCanEdit(
    caps: Capabilities,
    positionIds: (number | null)[]
  ): Promise<void> {
    const positions = await this.repository.getExecPositions();
    for (const positionId of positionIds) {
      const position = positionId === null ? null : positions.find((p) => p.id === positionId);
      if (position === undefined) throw new ApiError("Position not found", 404);
      const allowed = canEditQuestionsFor(
        caps,
        position && { subteamId: position.subteam_id, isVp: position.is_vp }
      );
      if (!allowed) {
        throw new ApiError(
          positionId === null
            ? "Only presidents can edit General questions"
            : "You can only edit questions for your subteam's positions",
          403
        );
      }
    }
  }
}

export const setupService = new SetupService();
