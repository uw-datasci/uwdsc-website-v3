import {
  ApiError,
  CompleteProfileData,
  Profile,
  ProfileUpdateData,
} from "@uwdsc/types";
import { ProfileRepository } from "../repositories/profileRepository";

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
  async completeProfile(
    userId: string,
    data: CompleteProfileData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      data.is_math_soc_member = data.faculty === "math";
      const result = await this.repository.completeProfile(userId, data);
      if (!result) {
        return {
          success: false,
          error: "Profile not found",
        };
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(
        `Failed to update profile: ${(error as Error).message}`,
        500,
      );
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
      if (!result) {
        return {
          success: false,
          error: "Profile not found",
        };
      }

      return { success: true };
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
        profile.term
      );
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }
  }
}

export const profileService = new ProfileService();
