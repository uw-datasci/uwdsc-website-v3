import {
  computeCapabilities,
  toRecruitingRole,
  type RecruitingCapabilities,
  type RecruitingCycleSummary,
} from "@uwdsc/common/recruiting";
import type { RoleClaims } from "@uwdsc/common/constants";
import { ApiError } from "@uwdsc/common/types";
import { RecruitingRepository, type StartableTermRow } from "./recruiting.repository";

class RecruitingService {
  private readonly repository: RecruitingRepository;

  constructor() {
    this.repository = new RecruitingRepository();
  }

  /**
   * The viewer's capabilities for the current cycle. Returns null when the viewer's
   * role has no Recruiting access (anything other than pres / admin).
   */
  async getContext(claims: RoleClaims): Promise<RecruitingCapabilities | null> {
    const role = toRecruitingRole(claims.role);
    if (!role) return null;

    const cycle = await this.getCurrentCycle();
    return computeCapabilities(
      { role, subteamId: claims.subteamId, subteamName: claims.subteamName },
      cycle
    );
  }

  async getCurrentCycle(): Promise<RecruitingCycleSummary | null> {
    try {
      return await this.repository.getCurrentCycle();
    } catch (error) {
      throw new ApiError(`Failed to load hiring cycle: ${(error as Error).message}`, 500);
    }
  }

  /** Terms a new cycle can target: those starting after the active term. */
  async getStartableTerms(): Promise<StartableTermRow[]> {
    const activeTerm = await this.repository.getActiveTerm();
    if (!activeTerm) return [];
    return this.repository.getTermsStartingAfter(activeTerm.start_date);
  }

  /** Start the hiring cycle for the active term, hiring for `targetTermId`. */
  async startCycle(actorId: string, targetTermId: string): Promise<RecruitingCycleSummary> {
    const activeTerm = await this.repository.getActiveTerm();
    if (!activeTerm) throw new ApiError("There is no active term to start a cycle in", 404);

    const startable = await this.repository.getTermsStartingAfter(activeTerm.start_date);
    if (!startable.some((term) => term.id === targetTermId)) {
      throw new ApiError("The target term must start after the current term", 400);
    }

    const created = await this.repository.createCycle(activeTerm.id, targetTermId, actorId);
    if (!created) throw new ApiError("A hiring cycle already exists for this term", 409);

    const cycle = await this.repository.getCurrentCycle();
    if (!cycle) throw new ApiError("Hiring cycle was created but could not be loaded", 500);
    return cycle;
  }
}

export const recruitingService = new RecruitingService();
export type { StartableTermRow } from "./recruiting.repository";
