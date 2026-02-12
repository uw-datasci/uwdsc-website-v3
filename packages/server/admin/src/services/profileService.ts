import {
  ApiError,
  MarkAsPaidData,
  Profile,
  UpdateMemberData,
} from "@uwdsc/types";
import { ProfileRepository } from "../repositories/profileRepository";

class ProfileService {
  private readonly repository: ProfileRepository;

  constructor() {
    this.repository = new ProfileRepository();
  }

  /**
   * Get all user profiles (admin only)
   */
  async getAllProfiles(): Promise<Profile[]> {
    try {
      return await this.repository.getAllProfiles();
    } catch (error) {
      throw new ApiError(
        `Failed to get all profiles: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get membership statistics (admin only)
   */
  async getMembershipStats(): Promise<{
    totalUsers: number;
    paidUsers: number;
    mathSocMembers: number;
  }> {
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
   * Mark a member as paid (admin only)
   */
  async markMemberAsPaid(
    profileId: string,
    data: MarkAsPaidData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.repository.markAsPaid(profileId, data);
    } catch (error) {
      throw new ApiError(
        `Failed to mark member as paid: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Update member information (admin only)
   */
  async updateMember(
    profileId: string,
    data: UpdateMemberData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.repository.updateMemberById(profileId, data);
    } catch (error) {
      throw new ApiError(
        `Failed to update member: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Delete a member (admin only)
   */
  async deleteMember(
    profileId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.repository.deleteMemberById(profileId);
    } catch (error) {
      throw new ApiError(
        `Failed to delete member: ${(error as Error).message}`,
        500,
      );
    }
  }
}

export const profileService = new ProfileService();
