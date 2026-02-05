import { ProfileRepository } from "../repositories/profileRepository";
import { ApiError } from "../types/errors";
import type {
  MarkAsPaidData,
  Profile,
  ProfileUpdateData,
  UpdateMemberData,
} from "../types/profile";

class ProfileService {
  private readonly repository: ProfileRepository;

  constructor() {
    this.repository = new ProfileRepository();
  }

  /**
   * Get profile by user ID
   */
  async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      return await this.repository.getProfileByUserId(userId);
    } catch (error) {
      throw new ApiError(
        `Failed to get profile: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: ProfileUpdateData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return await this.repository.updateProfile(userId, data);
    } catch (error) {
      throw new ApiError(
        `Failed to update profile: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Check if a user's profile is complete
   */
  async isProfileComplete(userId: string): Promise<boolean> {
    try {
      const profile = await this.repository.getProfileByUserId(userId);

      if (!profile) return false;

      // Profile is complete if required fields are filled
      return !!(
        profile.first_name &&
        profile.last_name &&
        profile.faculty &&
        profile.term &&
        profile.heard_from_where
      );
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }
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
