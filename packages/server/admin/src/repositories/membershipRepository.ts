import { BaseRepository } from "@uwdsc/db/baseRepository";
import { MarkAsPaidData, MembershipStats } from "@uwdsc/common/types";

export class MembershipRepository extends BaseRepository {
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
    const verifiedAtSql = data.verifier ? this.sql`NOW()` : this.sql`NULL`;

    try {
      const result = await this.sql`
        INSERT INTO memberships (
          profile_id,
          payment_method,
          payment_location,
          term_id,
          verifier_id,
          verified_at,
          updated_at
        )
        VALUES (
          ${profileId},
          ${data.payment_method}::payment_method_enum,
          ${data.payment_location},
          COALESCE(
            (
              SELECT t.id
              FROM terms t
              INNER JOIN profiles pr ON pr.term = t.code
              WHERE pr.id = ${profileId}
              LIMIT 1
            ),
            (SELECT id FROM terms WHERE is_active = true LIMIT 1)
          ),
          ${data.verifier},
          ${verifiedAtSql},
          NOW()
        )
        ON CONFLICT (profile_id)
        DO UPDATE SET
          payment_method = EXCLUDED.payment_method,
          payment_location = EXCLUDED.payment_location,
          term_id = EXCLUDED.term_id,
          verifier_id = EXCLUDED.verifier_id,
          verified_at = EXCLUDED.verified_at,
          updated_at = NOW()
        RETURNING *
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error marking member as paid:", error);
      throw error;
    }
  }
}
