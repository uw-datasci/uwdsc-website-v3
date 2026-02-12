import { BaseRepository } from "@uwdsc/db/baseRepository";
import { MarkAsPaidData, MembershipStats, Profile } from "@uwdsc/types";

export class ProfileRepository extends BaseRepository {
  /**
   * Get all user profiles with email from auth.users
   * Used for admin membership management
   */
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const result = await this.sql<Profile[]>`
      SELECT 
        p.first_name,
        p.last_name,
        au.email,
        p.wat_iam,
        p.faculty,
        p.term,
        p.is_math_soc_member,
        r.role,
        payment_method,
        payment_location,
        pv.first_name,
        pv.last_name
      FROM profiles p
      JOIN auth.users au ON p.id = au.id
      JOIN user_roles r ON p.id = r.id
      JOIN memberships m ON m.user_id = p.id
      JOIN profiles pv ON pv.id = verifier_id
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
  async getMembershipStats(): Promise<MembershipStats> {
    try {
      const result = await this.sql<MembershipStats[]>`
        SELECT 
          COUNT(*) as total_users,
          COUNT(*) FILTER (WHERE m.user_id IS NOT NULL) as paid_users,
          COUNT(*) FILTER (WHERE m.user_id IS NOT NULL AND p.is_math_soc_member = true) as math_soc_members
        FROM profiles p
        LEFT JOIN memberships m ON p.id = m.user_id
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
