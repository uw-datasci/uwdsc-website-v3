import { ApiError, CompleteProfileData, Profile, ProfileUpdateData } from "@uwdsc/common/types";
import { ProfileRepository } from "./profile.repository";

class ProfileService {
  private readonly repository: ProfileRepository;

  constructor() {
    this.repository = new ProfileRepository();
  }

  /**
   * Total number of registered profiles (community size).
   */
  async getProfileCount(): Promise<number> {
    try {
      return await this.repository.getProfileCount();
    } catch (error) {
      throw new ApiError(`Failed to count profiles: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get profile by user ID
   */
  async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      return await this.repository.getProfileByUserId(userId);
    } catch (error) {
      throw new ApiError(`Failed to get profile: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get profile fields needed for DSC Wrapped.
   */
  async getWrappedProfileStats(userId: string) {
    try {
      return await this.repository.getWrappedProfileStats(userId);
    } catch (error) {
      throw new ApiError(
        `Failed to get wrapped profile stats: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Update user profile
   */
  async completeProfile(
    userId: string,
    data: CompleteProfileData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      data.is_math_soc_member = data.faculty === "math";
      const result = await this.repository.completeProfile(userId, data);
      if (!result) return { success: false, error: "Profile not found" };

      return { success: true };
    } catch (error) {
      throw new ApiError(`Failed to update profile: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Update user profile (excludes is_math_soc_member and heard_from_where)
   */
  async updateProfile(
    userId: string,
    data: ProfileUpdateData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.repository.updateProfileByUser(userId, data);
      if (!result) return { success: false, error: "Profile not found" };

      return { success: true };
    } catch (error) {
      throw new ApiError(`Failed to update profile: ${(error as Error).message}`, 500);
    }
  }
}

export const profileService = new ProfileService();
