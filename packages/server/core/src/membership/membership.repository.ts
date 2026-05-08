import { BaseRepository } from "@uwdsc/db/base.repository";
import type { MembershipRow } from "./membership.types";

export class MembershipRepository extends BaseRepository {
  /**
   * Get a membership record for a given profile
   */
  async getMembershipByProfileId(
    profileId: string,
  ): Promise<MembershipRow | null> {
    try {
      const result = await this.sql<MembershipRow[]>`
        SELECT id, profile_id
        FROM memberships
        WHERE profile_id = ${profileId}
        LIMIT 1
      `;
      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching membership:", error);
      throw error;
    }
  }
}
