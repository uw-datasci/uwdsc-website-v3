import { BaseRepository } from "@uwdsc/db/base.repository";
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
        LEFT JOIN public.memberships m
          ON p.id = m.profile_id
         AND m.term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
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
   * Term id that `markAsPaid` would use for this profile (profile.term → terms, else active term).
   */
  async resolveTargetTermIdForProfile(profileId: string): Promise<string | null> {
    const result = await this.sql<{ term_id: string }[]>`
      SELECT COALESCE(
        (
          SELECT t.id
          FROM public.terms t
          INNER JOIN profiles pr ON pr.term = t.code
          WHERE pr.id = ${profileId}
          LIMIT 1
        ),
        (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
      ) AS term_id
    `;
    return result[0]?.term_id ?? null;
  }

  /**
   * Current membership term and payment method for the profile, if a row exists.
   */
  async getMembershipByProfile(
    profileId: string,
  ): Promise<{ term_id: string; payment_method: string | null } | null> {
    const result = await this.sql<{ term_id: string; payment_method: string | null }[]>`
      SELECT term_id, payment_method::text AS payment_method
      FROM public.memberships
      WHERE profile_id = ${profileId}
        AND term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
      LIMIT 1
    `;
    return result[0] ?? null;
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
        INSERT INTO public.memberships (
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
              FROM public.terms t
              INNER JOIN profiles pr ON pr.term = t.code
              WHERE pr.id = ${profileId}
              LIMIT 1
            ),
            (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
          ),
          ${data.verifier},
          ${verifiedAtSql},
          NOW()
        )
        ON CONFLICT (profile_id, term_id)
        DO UPDATE SET
          payment_method = EXCLUDED.payment_method,
          payment_location = EXCLUDED.payment_location,
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
