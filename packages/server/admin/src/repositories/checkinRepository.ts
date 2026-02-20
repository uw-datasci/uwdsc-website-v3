import { BaseRepository } from "@uwdsc/db/baseRepository";
import type { Profile } from "@uwdsc/common/types";

interface MembershipRow {
  id: string;
  profile_id: string;
}

interface AttendanceRow {
  id: string;
  event_id: string;
  profile_id: string;
}

export class CheckinRepository extends BaseRepository {
  /**
   * Get a membership record by its own ID
   */
  async getMembershipById(
    membershipId: string,
  ): Promise<MembershipRow | null> {
    try {
      const result = await this.sql<MembershipRow[]>`
        SELECT id, profile_id
        FROM memberships
        WHERE id = ${membershipId}
        LIMIT 1
      `;
      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching membership by ID:", error);
      throw error;
    }
  }

  /**
   * Get the profile associated with a membership ID
   */
  async getProfileByMembershipId(
    membershipId: string,
  ): Promise<Profile | null> {
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
        FROM memberships m
        JOIN profiles p ON m.profile_id = p.id
        WHERE m.id = ${membershipId}
        LIMIT 1
      `;
      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching profile by membership ID:", error);
      throw error;
    }
  }

  /**
   * Insert an attendance record
   */
  async insertAttendance(
    eventId: string,
    profileId: string,
  ): Promise<AttendanceRow | null> {
    try {
      const result = await this.sql<AttendanceRow[]>`
        INSERT INTO attendance (event_id, profile_id)
        VALUES (${eventId}, ${profileId})
        ON CONFLICT (event_id, profile_id) DO NOTHING
        RETURNING id, event_id, profile_id
      `;
      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error inserting attendance:", error);
      throw error;
    }
  }

  /**
   * Delete an attendance record
   */
  async deleteAttendance(
    eventId: string,
    profileId: string,
  ): Promise<boolean> {
    try {
      const result = await this.sql`
        DELETE FROM attendance
        WHERE event_id = ${eventId} AND profile_id = ${profileId}
        RETURNING id
      `;
      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error deleting attendance:", error);
      throw error;
    }
  }

  /**
   * Check if attendance already exists
   */
  async hasAttendance(
    eventId: string,
    profileId: string,
  ): Promise<boolean> {
    try {
      const result = await this.sql<{ exists: boolean }[]>`
        SELECT EXISTS(
          SELECT 1 FROM attendance
          WHERE event_id = ${eventId} AND profile_id = ${profileId}
        ) AS exists
      `;
      return result[0]?.exists ?? false;
    } catch (error: unknown) {
      console.error("Error checking attendance:", error);
      throw error;
    }
  }
}
