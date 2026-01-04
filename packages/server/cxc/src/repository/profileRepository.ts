import { BaseRepository } from "@uwdsc/server/core/repository/baseRepository";
import type { Profile } from "../types/profile";

export interface CreateProfileData {
  id: string;
  role?: string;
  nfc_id: string;
}

export class ProfileRepository extends BaseRepository {
  /**
   * Get user profile by user ID
   * @param userId - The auth.users.id (UUID)
   */
  async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      const result = await this.sql<Profile[]>`
        SELECT 
          id,
          role,
          nfc_id::text as nfc_id,
          created_at,
          updated_at
        FROM profiles
        WHERE id = ${userId}
      `;

      if (result.length === 0) return null;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  /**
   * Get profile by NFC ID
   * @param nfcId - The NFC ID
   */
  async getProfileByNfcId(nfcId: string): Promise<Profile | null> {
    try {
      const result = await this.sql<Profile[]>`
        SELECT 
          id,
          role,
          nfc_id::text as nfc_id,
          created_at,
          updated_at
        FROM profiles
        WHERE nfc_id::text = ${nfcId}
      `;

      if (result.length === 0) return null;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching profile by NFC ID:", error);
      return null;
    }
  }

  /**
   * Update or set NFC ID for a profile
   * @param userId - The auth.users.id (UUID)
   * @param nfcId - The NFC ID to set (string)
   */
  async updateNfcId(
    userId: string,
    nfcId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.sql`
        UPDATE profiles
        SET 
          nfc_id = ${nfcId},
          updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `;

      if (result.length === 0) {
        return {
          success: false,
          error: "Profile not found",
        };
      }

      return { success: true };
    } catch (error: unknown) {
      console.error("Error updating NFC ID:", error);
      // If the error is about type mismatch, provide a helpful message
      if (error instanceof Error && error.message.includes("bigint")) {
        return {
          success: false,
          error: "Database column nfc_id is BIGINT but needs to be VARCHAR/TEXT. Please run: ALTER TABLE profiles ALTER COLUMN nfc_id TYPE VARCHAR(255);",
        };
      }
      return {
        success: false,
        error: (error as Error).message || "Failed to update NFC ID",
      };
    }
  }

  /**
   * Create a new profile with NFC ID
   * If profile already exists, ensures it has an NFC ID
   * @param data - Profile data including user ID and NFC ID
   */
  async createProfile(data: CreateProfileData): Promise<{ success: boolean; error?: string }> {
    try {
      // Note: The database column might be BIGINT, but we're storing a string
      // We need to handle this by converting the string to a numeric representation
      // or by ensuring the column is VARCHAR. For now, we'll store it as text.
      const result = await this.sql`
        INSERT INTO profiles (id, role, nfc_id)
        VALUES (
          ${data.id},
          ${data.role ?? "default"}::role_enum,
          ${data.nfc_id}
        )
        ON CONFLICT (id) DO UPDATE SET
          nfc_id = CASE 
            WHEN profiles.nfc_id IS NULL THEN EXCLUDED.nfc_id
            ELSE profiles.nfc_id
          END,
          updated_at = NOW()
        RETURNING *
      `;

      if (result.length === 0) {
        return {
          success: false,
          error: "Failed to create profile",
        };
      }

      return { success: true };
    } catch (error: unknown) {
      console.error("Error creating profile:", error);
      // If the error is about type mismatch, provide a helpful message
      if (error instanceof Error && error.message.includes("bigint")) {
        return {
          success: false,
          error: "Database column nfc_id is BIGINT but needs to be VARCHAR/TEXT. Please run: ALTER TABLE profiles ALTER COLUMN nfc_id TYPE VARCHAR(255);",
        };
      }
      return {
        success: false,
        error: (error as Error).message || "Failed to create profile",
      };
    }
  }
}
