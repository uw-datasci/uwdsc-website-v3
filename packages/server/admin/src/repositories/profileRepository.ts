import { BaseRepository } from "@uwdsc/db/baseRepository";
import { Member, Profile, UserRole } from "@uwdsc/common/types";

export class ProfileRepository extends BaseRepository {
  /**
   * Get all user profiles with email from auth.users
   * Used for admin membership management
   */
  async getAllProfiles(options?: {
    paidOnly?: boolean;
    searchQuery?: string;
  }): Promise<Member[]> {
    try {
      let searchCondition = this.sql``;
      if (options?.searchQuery) {
        const query = `%${options.searchQuery}%`;
        searchCondition = this.sql`
          WHERE (
            p.wat_iam ILIKE ${query} OR
            au.email ILIKE ${query} OR
            p.first_name ILIKE ${query} OR
            p.last_name ILIKE ${query} OR
            CONCAT(p.first_name, ' ', p.last_name) ILIKE ${query}
          )
        `;
      }

      const limitCondition = options?.searchQuery
        ? this.sql`LIMIT 10`
        : this.sql``;

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
      ${searchCondition}
      ORDER BY au.created_at DESC
      ${limitCondition}
      `;

      return result;
    } catch (error: unknown) {
      console.error("Error fetching all profiles:", error);
      throw error;
    }
  }

  /**
   * Distinct login emails for users whose role is one of the given roles.
   */
  async getEmailsByRoles(roles: UserRole[]): Promise<string[]> {
    if (roles.length === 0) return [];

    try {
      const rows = await this.sql<{ email: string }[]>`
        SELECT DISTINCT au.email
        FROM profiles p
        JOIN auth.users au ON p.id = au.id
        JOIN user_roles r ON p.id = r.id
        WHERE r.role IN ${this.sql(roles)}
      `;
      return rows.map((row) => row.email).filter(Boolean);
    } catch (error: unknown) {
      console.error("Error fetching emails by roles:", error);
      throw error;
    }
  }

  /**
   * Get profile by login email (auth.users), case-insensitive.
   */
  async getProfileByEmail(email: string): Promise<Profile | null> {
    const normalized = email.trim().toLowerCase();

    try {
      const result = await this.sql<Profile[]>`
        SELECT
          p.id,
          p.first_name,
          p.last_name,
          au.email,
          p.wat_iam,
          p.faculty,
          p.term,
          p.is_math_soc_member,
          r.role AS role
        FROM profiles p
        JOIN auth.users au ON p.id = au.id
        JOIN user_roles r ON p.id = r.id
        WHERE lower(trim(au.email)) = ${normalized}
        LIMIT 1
      `;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching profile by email:", error);
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
