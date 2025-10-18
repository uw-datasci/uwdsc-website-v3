import { BaseCxcRepository } from "./baseCxcRepository";

export interface ProfileUpdateData {
  first_name: string;
  last_name: string;
  dob: Date;
}

export class ProfileRepository extends BaseCxcRepository {
  /**
   * Update user profile by user ID
   * Uses raw pg query for direct database access
   * @param userId - The auth.users.id (UUID)
   * @param data - Profile data to update
   */
  async updateProfile(
    userId: string,
    data: ProfileUpdateData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const query = `
        UPDATE profiles
        SET 
          first_name = $1,
          last_name = $2,
          dob = $3,
          updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `;

      const values = [data.first_name, data.last_name, data.dob, userId];

      const result = await this.pool.query(query, values);

      if (result.rowCount === 0) {
        return {
          success: false,
          error: "Profile not found",
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        error: error.message || "Failed to update profile",
      };
    }
  }

  /**
   * Get user profile by user ID
   * @param userId - The auth.users.id (UUID)
   */
  async getProfileByUserId(userId: string): Promise<any> {
    try {
      const query = `
        SELECT *
        FROM profiles
        WHERE id = $1
      `;

      const result = await this.pool.query(query, [userId]);

      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }
}
