import { ApiError } from "@uwdsc/server/core/utils/errors";
import { ProfileRepository } from "../repository/profileRepository";
import type { Profile } from "../types/profile";
import { generateNfcId } from "../utils/nfc";

export class ProfileService {
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
   * Get profile by NFC ID
   */
  async getProfileByNfcId(nfcId: string): Promise<Profile | null> {
    try {
      return await this.repository.getProfileByNfcId(nfcId);
    } catch (error) {
      throw new ApiError(
        `Failed to get profile by NFC ID: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get or generate NFC ID for a user
   */
  async getOrGenerateNfcId(userId: string): Promise<string> {
    try {
      const profile = await this.repository.getProfileByUserId(userId);

      if (!profile) {
        throw new ApiError("Profile not found", 404);
      }

      // If NFC ID already exists, return it
      if (profile.nfc_id) {
        return profile.nfc_id;
      }

      // Generate new NFC ID
      const nfcId = generateNfcId(profile.id);

      // Update profile with NFC ID
      const result = await this.repository.updateNfcId(userId, nfcId);

      if (!result.success) {
        throw new ApiError(result.error || "Failed to update NFC ID", 500);
      }

      return nfcId;
    } catch (error) {
      throw new ApiError(
        `Failed to get or generate NFC ID: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Create a new profile with NFC ID
   */
  async createProfile(userId: string, role?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Generate NFC ID for the new user
      const nfcId = generateNfcId(userId);

      // Create profile with NFC ID
      const result = await this.repository.createProfile({
        id: userId,
        role: role ?? "default",
        nfc_id: nfcId,
      });

      if (!result.success) {
        throw new ApiError(result.error || "Failed to create profile", 500);
      }

      return { success: true };
    } catch (error) {
      throw new ApiError(
        `Failed to create profile: ${(error as Error).message}`,
        500,
      );
    }
  }
}
