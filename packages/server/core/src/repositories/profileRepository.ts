import type {
  MarkAsPaidData,
  Profile,
  ProfileUpdateData,
  UpdateMemberData,
} from "../types/profile";
import { BaseRepository } from "./baseRepository";

export class ProfileRepository extends BaseRepository {
  /**
   * Update user profile by user ID
   * Uses postgres.js for direct database access
   * @param userId - The auth.users.id (UUID)
   * @param data - Profile data to update
   */
  async updateProfile(
    userId: string,
    data: ProfileUpdateData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const isMathSocMember = data.faculty === "math";

      const result = await this.sql`
        UPDATE profiles
        SET 
          first_name = ${data.first_name},
          last_name = ${data.last_name},
          wat_iam = ${data.wat_iam ?? null},
          faculty = ${data.faculty}::faculty_enum,
          term = ${data.term},
          heard_from_where = ${data.heard_from_where},
          updated_at = NOW(),
          is_math_soc_member = ${isMathSocMember}
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
      console.error("Error updating profile:", error);
      return {
        success: false,
        error: (error as Error).message || "Failed to update profile",
      };
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
          p.id,
          au.email,
          p.first_name,
          p.last_name,
          p.wat_iam,
          p.faculty,
          p.term,
          p.heard_from_where,
          p.is_math_soc_member
        FROM profiles p
        JOIN auth.users au ON p.id = au.id
        WHERE p.id = ${userId}
      `;

      if (result.length === 0) {
        return null;
      }

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  /**
   * Get all user profiles with email from auth.users
   * Used for admin membership management
   */
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const result = await this.sql<Profile[]>`
        SELECT 
          p.id,
          au.email,
          p.first_name,
          p.last_name,
          ur.role as user_role,
          CASE WHEN m.user_id IS NOT NULL THEN true ELSE false END as has_paid,
          p.is_math_soc_member,
          p.faculty,
          p.term,
          p.wat_iam,
          m.verifier_id::text as verifier,
          p.heard_from_where,
          m.payment_method,
          m.payment_location,
          NULL as member_ideas
        FROM profiles p
        LEFT JOIN auth.users au ON p.id = au.id
        LEFT JOIN user_roles ur ON p.id = ur.id
        LEFT JOIN memberships m ON p.id = m.user_id
        ORDER BY au.created_at DESC
      `;

      return result;
    } catch (error: unknown) {
      console.error("Error fetching all profiles:", error);
      throw error;
    }
  }

  /**
   * Get membership statistics
   */
  async getMembershipStats(): Promise<{
    totalUsers: number;
    paidUsers: number;
    mathSocMembers: number;
  }> {
    try {
      const result = await this.sql<
        { total_users: number; paid_users: number; math_soc_members: number }[]
      >`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE m.user_id IS NOT NULL) as paid_users,
          COUNT(*) FILTER (WHERE m.user_id IS NOT NULL AND p.is_math_soc_member = true) as math_soc_members
        FROM profiles p
        LEFT JOIN memberships m ON p.id = m.user_id
      `;

      const row = result[0] ?? {
        total_users: 0,
        paid_users: 0,
        math_soc_members: 0,
      };

      return {
        totalUsers: row.total_users,
        paidUsers: row.paid_users,
        mathSocMembers: row.math_soc_members,
      };
    } catch (error: unknown) {
      console.error("Error fetching membership stats:", error);
      throw error;
    }
  }

  /**
   * Mark a member as paid by profile ID
   * @param profileId - The profile ID (UUID)
   * @param data - Payment data (method, location, verifier)
   */
  async markAsPaid(
    profileId: string,
    data: MarkAsPaidData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // First verify the profile exists
      const profileCheck = await this.sql`
        SELECT id FROM profiles WHERE id = ${profileId}
      `;

      if (profileCheck.length === 0) {
        return {
          success: false,
          error: "Profile not found",
        };
      }

      // Insert or update membership record
      const result = await this.sql`
        INSERT INTO memberships (user_id, payment_method, payment_location, verifier_id, verified_at, updated_at)
        VALUES (${profileId}, ${data.payment_method}::payment_method_enum, ${data.payment_location}, ${data.verifier}::uuid, NOW(), NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET
          payment_method = ${data.payment_method}::payment_method_enum,
          payment_location = ${data.payment_location},
          verifier_id = ${data.verifier}::uuid,
          verified_at = NOW(),
          updated_at = NOW()
        RETURNING *
      `;

      if (result.length === 0) {
        return {
          success: false,
          error: "Failed to create membership record",
        };
      }

      return { success: true };
    } catch (error: unknown) {
      console.error("Error marking member as paid:", error);
      return {
        success: false,
        error: (error as Error).message || "Failed to mark as paid",
      };
    }
  }

  /**
   * Update member information by profile ID
   * @param profileId - The profile ID (UUID)
   * @param data - Member data to update
   */
  async updateMemberById(
    profileId: string,
    data: UpdateMemberData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Build the update query dynamically based on whether faculty is provided
      const facultyValue = data.faculty
        ? this.sql`${data.faculty}::faculty_enum`
        : this.sql`NULL`;

      const result = await this.sql`
        UPDATE profiles
        SET 
          first_name = ${data.first_name},
          last_name = ${data.last_name},
          wat_iam = ${data.wat_iam ?? null},
          faculty = ${facultyValue},
          term = ${data.term ?? null},
          is_math_soc_member = ${data.is_math_soc_member},
          updated_at = NOW()
        WHERE id = ${profileId}
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
      console.error("Error updating member:", error);
      return {
        success: false,
        error: (error as Error).message || "Failed to update member",
      };
    }
  }

  /**
   * Delete a member by profile ID
   * @param profileId - The profile ID (UUID)
   */
  async deleteMemberById(
    profileId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // First, delete the user from auth.users (this will cascade to profiles)
      const result = await this.sql`
        DELETE FROM auth.users
        WHERE id = ${profileId}
        RETURNING id
      `;

      if (result.length === 0) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return { success: true };
    } catch (error: unknown) {
      console.error("Error deleting member:", error);
      return {
        success: false,
        error: (error as Error).message || "Failed to delete member",
      };
    }
  }
}
