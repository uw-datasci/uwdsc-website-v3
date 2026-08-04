import { BaseRepository } from "@uwdsc/db/base.repository";
import type { ScannedMembership, ScanEvent } from "../../types/passport";

export class PassportRepository extends BaseRepository {
  /**
   * Get a membership by id, but only if it belongs to the currently
   * active term. Returns the profile_id of the scanned member, which
   * downstream validation (token check, role lookup) depends on.
   */
  async getActiveMembershipById(
    membershipId: string,
  ): Promise<ScannedMembership | null> {
    const result = await this.sql<ScannedMembership[]>`
      SELECT id, profile_id
      FROM public.memberships
      WHERE id = ${membershipId}
        AND term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
      LIMIT 1
    `;
    return result[0] ?? null;
  }

  /**
   * Get an event by id along with the stamp it can unlock.
   */
  async getEventById(eventId: string): Promise<ScanEvent | null> {
    const result = await this.sql<ScanEvent[]>`
      SELECT id, stamp_id
      FROM events.events
      WHERE id = ${eventId}
      LIMIT 1
    `;
    return result[0] ?? null;
  }

  /**
   * Role of the scanned member: determines their bonus drop rate.
   * Users without a user_roles row are plain members.
   */
  async getUserRole(profileId: string): Promise<string> {
    const result = await this.sql<{ role: string }[]>`
      SELECT role
      FROM public.user_roles
      WHERE id = ${profileId}
      LIMIT 1
    `;
    return result[0]?.role ?? "member";
  }

  /**
   * Lifetime number of QR codes this user has scanned: drives the
   * base probability (+1% per scan).
   */
  async countScansByScanner(scannerProfileId: string): Promise<number> {
    const result = await this.sql<{ count: string }[]>`
      SELECT COUNT(*) AS count
      FROM passport.qrcode_scans
      WHERE scanner_profile_id = ${scannerProfileId}
    `;
    return Number(result[0]?.count ?? 0);
  }

  /**
   * Whether the user already owns a given stamp.
   */
  async hasStamp(profileId: string, stampId: string): Promise<boolean> {
    const result = await this.sql<{ id: string }[]>`
      SELECT id
      FROM passport.user_stamps
      WHERE profile_id = ${profileId} AND stamp_id = ${stampId}
      LIMIT 1
    `;
    return result.length > 0;
  }

  /**
   * Record a scan. The table's UNIQUE (scanner, scanned, event)
   * constraint makes this the duplicate check as well: inserting
   * returns a row only for a first-time scan, so two racing requests
   * can never both count.
   */
  async recordScan(
    scannerProfileId: string,
    scannedProfileId: string,
    eventId: string,
  ): Promise<boolean> {
    const result = await this.sql<{ id: string }[]>`
      INSERT INTO passport.qrcode_scans (scanner_profile_id, scanned_profile_id, event_id)
      VALUES (${scannerProfileId}, ${scannedProfileId}, ${eventId})
      ON CONFLICT (scanner_profile_id, scanned_profile_id, event_id) DO NOTHING
      RETURNING id
    `;
    return result.length > 0;
  }

  /**
   * Add a stamp to the user's collection. ON CONFLICT keeps a
   * double-award harmless (unique per profile + stamp).
   */
  async awardStamp(profileId: string, stampId: string): Promise<void> {
    await this.sql`
      INSERT INTO passport.user_stamps (profile_id, stamp_id)
      VALUES (${profileId}, ${stampId})
      ON CONFLICT (profile_id, stamp_id) DO NOTHING
    `;
  }
}
