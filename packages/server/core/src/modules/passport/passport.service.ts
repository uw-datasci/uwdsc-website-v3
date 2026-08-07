import { createHmac } from "node:crypto";
import { ApiError } from "@uwdsc/common/types";
import type { ScanOutcome } from "@uwdsc/common/types";
import { PassportRepository } from "./passport.repository";

const TIME_STEP_SECONDS = 30;

/** Drop rate bonus based on the role of the person scanned. */
const ROLE_DROP_RATE: Record<string, number> = {
  member: 0,
  alum: 0.05,
  exec: 0.075,
  admin: 0.1,
  pres: 0.15,
};

/** Base probability gained per lifetime scan. */
const BASE_RATE_PER_SCAN = 0.01;

class PassportService {
  private readonly repository = new PassportRepository();

  /** Validate a scanned QR, record the scan and roll for the event stamp. */
  async scanQrCode(
    scannerProfileId: string,
    params: { membershipId: string; eventId: string; token: string },
  ): Promise<ScanOutcome> {
    try {
      return await this.processScan(scannerProfileId, params);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to process scan: ${(error as Error).message}`,
        500,
      );
    }
  }

  private async processScan(
    scannerProfileId: string,
    params: { membershipId: string; eventId: string; token: string },
  ): Promise<ScanOutcome> {
    const membership = await this.repository.getActiveMembershipById(
      params.membershipId,
    );
    if (!membership) {
      throw new ApiError("Invalid or inactive membership", 400);
    }

    const scannedProfileId = membership.profile_id;
    if (scannedProfileId === scannerProfileId) {
      throw new ApiError("You cannot scan your own passport", 400);
    }

    const event = await this.repository.getEventById(params.eventId);
    if (!event) throw new ApiError("Invalid event", 400);
    if (!event.stamp_id) throw new ApiError("Event has no stamp", 400);

    if (!this.isTokenValid(scannedProfileId, params.token)) {
      throw new ApiError("Expired or invalid QR code", 400);
    }

    // base probability counts scans made BEFORE this one
    const priorScans =
      await this.repository.countScansByScanner(scannerProfileId);

    const isNewScan = await this.repository.recordScan(
      scannerProfileId,
      scannedProfileId,
      params.eventId,
    );
    if (!isNewScan) return { outcome: "already_scanned" };

    if (await this.repository.hasStamp(scannerProfileId, event.stamp_id)) {
      return { outcome: "already_has_stamp" };
    }

    const scannedRole = await this.repository.getUserRole(scannedProfileId);
    const probability =
      priorScans * BASE_RATE_PER_SCAN + (ROLE_DROP_RATE[scannedRole] ?? 0);

    if (Math.random() < probability) {
      await this.repository.awardStamp(scannerProfileId, event.stamp_id);
      return { outcome: "won", probability, stampId: event.stamp_id };
    }
    return { outcome: "lost", probability };
  }

  /**
   * Recompute the token the same way qr.ts generates it. Current and
   * previous timestep are accepted, so screenshots expire within a minute.
   */
  private isTokenValid(userId: string, token: string): boolean {
    const step = Math.floor(Date.now() / (TIME_STEP_SECONDS * 1000));
    return [step, step - 1].some(
      (s) =>
        createHmac("sha256", userId).update(String(s)).digest("hex") === token,
    );
  }
}

export const passportService = new PassportService();
