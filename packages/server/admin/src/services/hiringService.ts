import {
  ApiError,
  type ApplicationReviewStatus,
  type FinalizeRolesSummary,
  type HiringApplicant,
  type NewExecTeamMember,
  type UserRole,
} from "@uwdsc/common/types";
import { HiringRepository } from "../repositories/hiringRepository";
import { emailService } from "./emailService";
import { formatTermCode } from "@uwdsc/common/utils";

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
      throw new ApiError(`Failed to get hiring applicants: ${(error as Error).message}`, 500);
    }
  }

  async updateSelectionStatus(
    selectionId: string,
    status: ApplicationReviewStatus,
  ): Promise<void> {
    if (!PRESIDENT_ONLY_STATUSES.has(status)) {
      throw new ApiError("Only president-level statuses are allowed on the hiring page", 400);
    }

    try {
      if (status === "Accepted Offer") {
        const hasOtherAccepted = await this.repository.hasAcceptedAnotherOffer(selectionId);
        if (hasOtherAccepted) {
          throw new ApiError(
            "This applicant already has an accepted offer for another position.",
            400,
          );
        }
      }

      const updated = await this.repository.updatePositionSelectionStatus(selectionId, status);
      if (!updated) throw new ApiError("Position selection not found", 404);

      if (status === "Offer Sent" || status === "Rejection Sent") {
        const recipient = await this.repository.getSelectionRecipient(selectionId);
        if (!recipient) throw new ApiError("Selection recipient not found", 404);

        const type = status === "Offer Sent" ? "offer" : "rejection";
        await emailService.sendHiringDecisionEmail(recipient.email, {
          type,
          applicantName: recipient.full_name,
          positionName: recipient.position_name,
          offerTermLabel: recipient.term_code ? formatTermCode(recipient.term_code) : undefined,
        });
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to update selection status: ${(error as Error).message}`, 500);
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
      throw new ApiError(`Failed to get new exec team: ${(error as Error).message}`, 500);
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

      const promoted_to_admin = team.filter((m) => m.computed_role === "admin").length;
      const promoted_to_exec = team.filter((m) => m.computed_role === "exec").length;

      return {
        promoted_to_admin,
        promoted_to_exec,
        demoted_to_member: demoted,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to finalize roles: ${(error as Error).message}`, 500);
    }
  }
}

export const hiringService = new HiringService();
