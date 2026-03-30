import {
  ApiError,
  type ApplicationReviewStatus,
  type FinalizeRolesSummary,
  type HiringApplicant,
  type NewExecTeamMember,
  type UserRole,
} from "@uwdsc/common/types";
import { HiringRepository } from "../repositories/hiringRepository";

const PRESIDENT_ONLY_STATUSES = new Set<ApplicationReviewStatus>([
  "Offer Sent",
  "Accepted Offer",
  "Declined Offer",
  "Rejection Sent",
]);

class HiringService {
  private readonly repository: HiringRepository;

  constructor() {
    this.repository = new HiringRepository();
  }

  async getHiringApplicants(): Promise<HiringApplicant[]> {
    try {
      return await this.repository.getHiringApplicants();
    } catch (error) {
      throw new ApiError(
        `Failed to get hiring applicants: ${(error as Error).message}`,
        500,
      );
    }
  }

  async updateSelectionStatus(
    selectionId: string,
    status: ApplicationReviewStatus,
  ): Promise<void> {
    if (!PRESIDENT_ONLY_STATUSES.has(status)) {
      throw new ApiError(
        "Only president-level statuses are allowed on the hiring page",
        400,
      );
    }

    try {
      const updated = await this.repository.updatePositionSelectionStatus(
        selectionId,
        status,
      );
      if (!updated) throw new ApiError("Position selection not found", 404);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to update selection status: ${(error as Error).message}`,
        500,
      );
    }
  }

  async getNewExecTeam(): Promise<NewExecTeamMember[]> {
    try {
      const rows = await this.repository.getAcceptedOfferSelections();
      return rows.map((row) => {
        const computed_role: UserRole =
          row.is_vp || row.subteam_name === "Presidents" ? "admin" : "exec";
        return { ...row, computed_role };
      });
    } catch (error) {
      throw new ApiError(
        `Failed to get new exec team: ${(error as Error).message}`,
        500,
      );
    }
  }

  async finalizeRoles(): Promise<FinalizeRolesSummary> {
    try {
      const team = await this.getNewExecTeam();

      const newTeamRoles = team.map((m) => ({
        profileId: m.profile_id,
        role: m.computed_role,
      }));

      const { demoted } = await this.repository.finalizeRoles(newTeamRoles);

      const promoted_to_admin = team.filter(
        (m) => m.computed_role === "admin",
      ).length;
      const promoted_to_exec = team.filter(
        (m) => m.computed_role === "exec",
      ).length;

      return {
        promoted_to_admin,
        promoted_to_exec,
        demoted_to_member: demoted,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to finalize roles: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const hiringService = new HiringService();
