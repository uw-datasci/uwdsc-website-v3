import {
  CompleteProfileData,
  Profile,
  ProfileUpdateData,
} from "@uwdsc/common/types";
import { BaseRepository } from "@uwdsc/db/baseRepository";

export class ProfileRepository extends BaseRepository {
  /**
   * Update user profile by user ID
   * Uses postgres.js for direct database access
   * @param userId - The auth.users.id (UUID)
   * @param data - Profile data to update
   */
  async completeProfile(
    userId: string,
    data: CompleteProfileData,
  ): Promise<boolean> {
    try {
      const result = await this.sql`
        UPDATE profiles
        SET 
          first_name = ${data.first_name},
          last_name = ${data.last_name},
          wat_iam = ${data.wat_iam},
          faculty = ${data.faculty}::faculty_enum,
          term = ${data.term},
          heard_from_where = ${data.heard_from_where},
          updated_at = NOW(),
          is_math_soc_member = ${data.is_math_soc_member}
        WHERE id = ${userId}
        RETURNING *
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Update user profile by user ID (excludes is_math_soc_member and heard_from_where)
   * @param userId - The auth.users.id (UUID)
   * @param data - Profile data to update (first_name, last_name, wat_iam, faculty, term only)
   */
  async updateProfileByUser(
    userId: string,
    data: ProfileUpdateData,
  ): Promise<boolean> {
    try {
      const result = await this.sql`
        UPDATE profiles
        SET 
          first_name = ${data.first_name},
          last_name = ${data.last_name},
          wat_iam = ${data.wat_iam},
          faculty = ${data.faculty}::faculty_enum,
          term = ${data.term},
          updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * Get user profile by user ID
   * @param userId - The auth.users.id (UUID)
   */
  async getProfileByUserId(userId: string): Promise<Profile | null> {
    try {
      const result = await this.sql<Profile[]>`
        SELECT 
          first_name,
          last_name,
          email,
          wat_iam,
          faculty,
          term,
          is_math_soc_member,
          ur.role as user_role
        FROM profiles p
        JOIN auth.users au ON p.id = au.id
        JOIN user_roles ur ON p.id = ur.id
        WHERE p.id = ${userId}
        LIMIT 1
      `;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }
}
