import type { RecruitingCapabilities, RecruitingCycleSummary } from "@uwdsc/common/recruiting";
import type { CreatePositionInput, CreateSubteamInput } from "@uwdsc/common/schemas";
import { ApiError } from "@uwdsc/common/types";
import { RecruitingRepository } from "./recruiting.repository";
import { StructureRepository } from "./structure.repository";

type Capabilities = Pick<RecruitingCapabilities, "can" | "cycle">;

const PRESIDENTS_SUBTEAM = "Presidents";

function isUniqueViolation(error: unknown): boolean {
  return (error as { code?: string } | null)?.code === "23505";
}

/** Presidents add subteams and positions from Recruiting (add-only; see subteam retirement). */
class StructureService {
  private readonly repository = new StructureRepository();
  private readonly recruiting = new RecruitingRepository();

  /**
   * A new subteam with its VP position. A retired subteam with the same name is restored
   * instead (keeping its history), with a VP position added if it has none.
   */
  async createSubteam(
    caps: Capabilities,
    input: CreateSubteamInput
  ): Promise<{ subteamId: number; restored: boolean }> {
    this.requireCycle(caps);

    const existing = await this.repository.findSubteamByName(input.name);
    if (existing && existing.retired_at === null) {
      throw new ApiError(`There's already a subteam called ${existing.name}`, 409);
    }

    const needsVpPosition = !existing || existing.vp_positions === 0;
    if (needsVpPosition) await this.assertPositionNameFree(input.vpPositionName);

    try {
      if (existing) {
        await this.repository.restoreSubteam(
          existing.id,
          needsVpPosition ? input.vpPositionName : null
        );
        return { subteamId: existing.id, restored: true };
      }
      const created = await this.repository.createSubteam(input.name, input.vpPositionName);
      return { subteamId: created.subteamId, restored: false };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ApiError("That subteam or position name was just taken. Try another.", 409);
      }
      throw error;
    }
  }

  /**
   * A new exec or VP position on an active subteam. With `openInCycle` (Setup, after the
   * lock) an exec position also opens in the current cycle.
   */
  async createPosition(
    caps: Capabilities,
    input: CreatePositionInput
  ): Promise<{ positionId: number }> {
    const cycle = this.requireCycle(caps);

    const subteam = await this.repository.getSubteam(input.subteamId);
    if (!subteam) throw new ApiError("Subteam not found", 404);
    if (subteam.name === PRESIDENTS_SUBTEAM) {
      throw new ApiError("Presidents only has the President position", 400);
    }
    if (subteam.retired_at !== null) {
      throw new ApiError(`${subteam.name} no longer exists`, 400);
    }
    const retiring = await this.recruiting.getRetiredSubteams(cycle.id);
    if (retiring.some((s) => s.id === subteam.id)) {
      throw new ApiError(`${subteam.name} won't continue next term`, 400);
    }
    if (input.openInCycle && input.isVp) {
      throw new ApiError("VP seats are opened from Leadership", 400);
    }
    if (input.openInCycle && !cycle.rosterLockedAt) {
      throw new ApiError("Pick hiring positions in Leadership until it's locked", 400);
    }

    await this.assertPositionNameFree(input.name);
    try {
      const positionId = await this.repository.createPosition({
        subteamId: subteam.id,
        name: input.name,
        isVp: input.isVp,
        openInCycleId: input.openInCycle ? cycle.id : null,
      });
      return { positionId };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ApiError(`There's already a position called ${input.name}`, 409);
      }
      throw error;
    }
  }

  private requireCycle(caps: Capabilities): RecruitingCycleSummary {
    if (!caps.cycle || !caps.can.editStructure) {
      throw new ApiError("Only presidents can add subteams and positions", 403);
    }
    return caps.cycle;
  }

  private async assertPositionNameFree(name: string): Promise<void> {
    const clash = await this.repository.findPositionByName(name);
    if (clash) {
      throw new ApiError(
        `There's already a position called ${clash.name}${clash.subteam_name ? ` (${clash.subteam_name})` : ""}`,
        409
      );
    }
  }
}

export const structureService = new StructureService();
