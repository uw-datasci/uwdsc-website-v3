import { BaseRepository } from "@uwdsc/db/base.repository";
import type { ScannedMembership, ScanEvent } from "../../types/passport";

export class PassportRepository extends BaseRepository {
  /** Get a membership by id if it belongs to the active term. */
  async getActiveMembershipById(
    membershipId: string,
  ): Promise<ScannedMembership | null> {
    try {
      const result = await this.sql<ScannedMembership[]>`
        SELECT id, profile_id
        FROM public.memberships
        WHERE id = ${membershipId}
          AND term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
        LIMIT 1
      `;
      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching membership for scan:", error);
      throw error;
    }
  }

  /** Get an event and the stamp it can unlock. */
  async getEventById(eventId: string): Promise<ScanEvent | null> {
    try {
      const result = await this.sql<ScanEvent[]>`
        SELECT id, stamp_id
        FROM events.events
        WHERE id = ${eventId}
        LIMIT 1
      `;
      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching event for scan:", error);
      throw error;
    }
  }

  /** Role of the scanned member, defaults to member. */
  async getUserRole(profileId: string): Promise<string> {
    try {
      const result = await this.sql<{ role: string }[]>`
        SELECT role
        FROM public.user_roles
        WHERE id = ${profileId}
        LIMIT 1
      `;
      return result[0]?.role ?? "member";
    } catch (error: unknown) {
      console.error("Error fetching user role:", error);
      throw error;
    }
  }

  /** Lifetime scan count, +1% base probability per scan. */
  async countScansByScanner(scannerProfileId: string): Promise<number> {
    try {
      const result = await this.sql<{ count: string }[]>`
        SELECT COUNT(*) AS count
        FROM passport.qrcode_scans
        WHERE scanner_profile_id = ${scannerProfileId}
      `;
      return Number(result[0]?.count ?? 0);
    } catch (error: unknown) {
      console.error("Error counting scans:", error);
      throw error;
    }
  }

  /** Whether the user already owns a given stamp. */
  async hasStamp(profileId: string, stampId: string): Promise<boolean> {
    try {
      const result = await this.sql<{ id: string }[]>`
        SELECT id
        FROM passport.user_stamps
        WHERE profile_id = ${profileId} AND stamp_id = ${stampId}
        LIMIT 1
      `;
      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error checking stamp ownership:", error);
      throw error;
    }
  }

  /**
   * Record a scan. Returns false if this person was already scanned
   * at this event (unique constraint handles the race).
   */
  async recordScan(
    scannerProfileId: string,
    scannedProfileId: string,
    eventId: string,
  ): Promise<boolean> {
    try {
      const result = await this.sql<{ id: string }[]>`
        INSERT INTO passport.qrcode_scans (scanner_profile_id, scanned_profile_id, event_id)
        VALUES (${scannerProfileId}, ${scannedProfileId}, ${eventId})
        ON CONFLICT (scanner_profile_id, scanned_profile_id, event_id) DO NOTHING
        RETURNING id
      `;
      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error recording scan:", error);
      throw error;
    }
  }

  /** Add a stamp to the user's collection. */
  async awardStamp(profileId: string, stampId: string): Promise<void> {
    try {
      await this.sql`
        INSERT INTO passport.user_stamps (profile_id, stamp_id)
        VALUES (${profileId}, ${stampId})
        ON CONFLICT (profile_id, stamp_id) DO NOTHING
      `;
    } catch (error: unknown) {
      console.error("Error awarding stamp:", error);
      throw error;
    }
  }
}
