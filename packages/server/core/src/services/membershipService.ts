import { MembershipRepository } from "../repositories/membershipRepository";
import { ApiError } from "@uwdsc/common/types";

class MembershipService {
  private readonly repository: MembershipRepository;

  constructor() {
    this.repository = new MembershipRepository();
  }

  /**
   * Check if a user has a membership and return their membership ID
   */
  async getMembershipStatus(
    profileId: string,
  ): Promise<{ has_membership: boolean; membership_id: string | null }> {
    try {
      const membership =
        await this.repository.getMembershipByProfileId(profileId);
      return {
        has_membership: !!membership,
        membership_id: membership?.id ?? null,
      };
    } catch (error) {
      throw new ApiError(
        `Failed to check membership: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const membershipService = new MembershipService();
