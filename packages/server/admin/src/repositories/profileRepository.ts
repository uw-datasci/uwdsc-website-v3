import { BaseRepository } from "@uwdsc/db/baseRepository";
import {
  MarkAsPaidData,
  Member,
  MembershipStats,
  Profile,
} from "@uwdsc/common/types";

export class ProfileRepository extends BaseRepository {
  /**
   * Get all user profiles with email from auth.users
   * Used for admin membership management
   */
  async getAllProfiles(options?: { paidOnly?: boolean }): Promise<Member[]> {
    try {
      const result = await this.sql<Member[]>`
      SELECT
        p.id,
        p.first_name,
        p.last_name,
        au.email,
        p.wat_iam,
        p.faculty,
        p.term,
        p.is_math_soc_member,
        r.role AS user_role,
        m.profile_id IS NOT NULL AS has_paid,
        m.payment_method,
        m.payment_location,
        NULLIF(TRIM(CONCAT_WS(' ', pv.first_name, pv.last_name)), '') AS verifier
      FROM profiles p
      JOIN auth.users au ON p.id = au.id
      JOIN user_roles r ON p.id = r.id
      ${
        options?.paidOnly
          ? this.sql`JOIN memberships m ON m.profile_id = p.id`
          : this.sql`LEFT JOIN memberships m ON m.profile_id = p.id`
      }
      LEFT JOIN profiles pv ON pv.id = m.verifier_id
      ORDER BY au.created_at DESC
      `;

      return result;
    } catch (error: unknown) {
      console.error("Error fetching all profiles:", error);
      throw error;
    }
  }

  /**
   * Get the profile by profile ID
   */
  async getProfileById(profileId: string): Promise<Profile | null> {
    try {
      const result = await this.sql<Profile[]>`
        SELECT
          p.id,
          p.first_name,
          p.last_name,
          p.wat_iam,
          p.faculty,
          p.term,
          p.is_math_soc_member
        FROM profiles p
        WHERE p.id = ${profileId}
        LIMIT 1
      `;
      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching profile by ID:", error);
      throw error;
    }
  }

  /**
   * Get membership statistics
   */
  async getMembershipStats(): Promise<MembershipStats> {
    try {
      const result = await this.sql<MembershipStats[]>`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE m.profile_id IS NOT NULL) as paid_users,
          COUNT(*) FILTER (WHERE m.profile_id IS NOT NULL AND p.is_math_soc_member = true) as math_soc_members
        FROM profiles p
        LEFT JOIN memberships m ON p.id = m.profile_id
      `;

      return (
        result[0] ?? {
          total_users: 0,
          paid_users: 0,
          math_soc_members: 0,
        }
      );
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
  async markAsPaid(profileId: string, data: MarkAsPaidData): Promise<boolean> {
    try {
      const result = await this.sql`
        INSERT INTO memberships (profile_id, payment_method, payment_location, verifier_id, verified_at, updated_at)
        VALUES (${profileId}, ${data.payment_method}::payment_method_enum, ${data.payment_location}, ${data.verifier}::uuid, NOW(), NOW())
        ON CONFLICT (profile_id) 
        DO UPDATE SET
          payment_method = ${data.payment_method}::payment_method_enum,
          payment_location = ${data.payment_location},
          verifier_id = ${data.verifier}::uuid,
          verified_at = NOW(),
          updated_at = NOW()
        RETURNING *
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error marking member as paid:", error);
      throw error;
    }
  }

  /**
   * Update member information by profile ID (partial update for PATCH)
   * @param profileId - The profile ID (UUID)
   * @param data - Partial member data - only fields to change
   */
  async updateMemberById(
    profileId: string,
    data: Record<string, string | boolean | null>,
    columns: string[],
  ): Promise<boolean> {
    try {
      const result = await this.sql`
        UPDATE profiles
        SET ${this.sql(data, ...columns)}, updated_at = NOW()
        WHERE id = ${profileId}
        RETURNING *
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error updating member:", error);
      throw error;
    }
  }

  /**
   * Delete a member by profile ID
   * @param profileId - The profile ID (UUID)
   */
  async deleteMemberById(profileId: string): Promise<boolean> {
    try {
      // First, delete the user from auth.users (this will cascade to profiles)
      const result = await this.sql`
        DELETE FROM auth.users
        WHERE id = ${profileId}
        RETURNING id
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error deleting member:", error);
      throw error;
    }
  }
}
