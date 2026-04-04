import { MembershipRepository } from "../repositories/membershipRepository";
import { ApiError, MarkAsPaidData, MembershipStats } from "@uwdsc/common/types";

class MembershipService {
  private readonly repository: MembershipRepository;

  constructor() {
    this.repository = new MembershipRepository();
  }

  /**
   * Get membership statistics
   */
  async getMembershipStats(): Promise<MembershipStats> {
    try {
      return await this.repository.getMembershipStats();
    } catch (error) {
      throw new ApiError(
        `Failed to get membership stats: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Mark a member as paid
   */
  async markMemberAsPaid(
    profileId: string,
    data: MarkAsPaidData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.repository.markAsPaid(profileId, data);

      if (!result) {
        return {
          success: false,
          error: "Failed to create membership record",
        };
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(
        `Failed to mark member as paid: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const membershipService = new MembershipService();
