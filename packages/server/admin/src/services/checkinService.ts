import { ApiError, type Profile, type Event } from "@uwdsc/common/types";
import { CheckinRepository } from "../repositories/checkinRepository";
import { profileService } from "./profileService";

const TIME_STEP_SECONDS = 30;

/**
 * Re-generate TOTP token for a given user ID and time step.
 */
async function generateTokenForStep(
  userId: string,
  timeStep: number,
): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(userId);
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const message = encoder.encode(String(timeStep));
  const signature = await crypto.subtle.sign("HMAC", key, message);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface CheckInResult {
  success: boolean;
  error?: string;
  profile?: Profile;
}

class CheckinService {
  private readonly repository: CheckinRepository;

  constructor() {
    this.repository = new CheckinRepository();
  }

  /**
   * Verify that the TOTP token is valid for the given user ID.
   * Checks current time step and ±1 step to allow for clock drift.
   */
  async verifyToken(userId: string, token: string): Promise<boolean> {
    const currentStep = Math.floor(Date.now() / (TIME_STEP_SECONDS * 1000));

    // Check current step and ±1 for clock drift tolerance
    for (const step of [currentStep, currentStep - 1, currentStep + 1]) {
      const expected = await generateTokenForStep(userId, step);
      if (expected === token) return true;
    }

    return false;
  }

  /**
   * Full validation and check-in flow:
   * 1. Validate event exists and is active
   * 2. Validate membership exists → get profile
   * 3. Verify TOTP token
   * 4. Check not already checked in
   * 5. Insert attendance
   */
  async validateAndCheckIn(
    event: Event,
    membershipId: string,
    token: string,
  ): Promise<CheckInResult> {
    try {
      // 1. Validate event is active
      const now = new Date();
      const bufferedStart = new Date(event.buffered_start_time);
      const bufferedEnd = new Date(event.buffered_end_time);
      if (now < bufferedStart || now > bufferedEnd) {
        return {
          success: false,
          error: "Event is not currently active for check-in",
        };
      }

      // 2. Validate membership and get profile
      const profile =
        await this.repository.getProfileByMembershipId(membershipId);
      if (!profile) {
        return { success: false, error: "Invalid membership" };
      }

      // 3. Verify TOTP token
      const tokenValid = await this.verifyToken(profile.id, token);
      if (!tokenValid) {
        return {
          success: false,
          error: "Invalid or expired check-in token",
        };
      }

      // 4. Check not already checked in
      const alreadyCheckedIn = await this.repository.hasAttendance(
        event.id,
        profile.id,
      );
      if (alreadyCheckedIn) {
        return {
          success: false,
          error: "Already checked in",
          profile,
        };
      }

      // 5. Insert attendance
      await this.repository.insertAttendance(event.id, profile.id);

      return { success: true, profile };
    } catch (error) {
      throw new ApiError(`Check-in failed: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Manual check-in flow (bypasses TOTP token and membership checks):
   * 1. Validate event exists and is active
   * 2. Validate profile exists
   * 3. Check not already checked in
   * 4. Insert attendance
   */
  async manualCheckIn(event: Event, profileId: string): Promise<CheckInResult> {
    try {
      // 1. Validate event is active
      const now = new Date();
      const bufferedStart = new Date(event.buffered_start_time);
      const bufferedEnd = new Date(event.buffered_end_time);
      if (now < bufferedStart || now > bufferedEnd) {
        return {
          success: false,
          error: "Event is not currently active for check-in",
        };
      }

      // 2. Validate profile exists
      const profile = await profileService.getProfileById(profileId);
      if (!profile) {
        return { success: false, error: "Invalid profile ID" };
      }

      // 3. Check not already checked in
      const alreadyCheckedIn = await this.repository.hasAttendance(
        event.id,
        profile.id,
      );
      if (alreadyCheckedIn) {
        return {
          success: false,
          error: "Already checked in",
          profile,
        };
      }

      // 4. Insert attendance
      await this.repository.insertAttendance(event.id, profile.id);

      return { success: true, profile };
    } catch (error) {
      throw new ApiError(
        `Manual Check-in failed: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Remove an attendance record (un-check-in).
   */
  async uncheckIn(eventId: string, profileId: string): Promise<boolean> {
    try {
      return await this.repository.deleteAttendance(eventId, profileId);
    } catch (error) {
      throw new ApiError(`Uncheck-in failed: ${(error as Error).message}`, 500);
    }
  }
}

export const checkinService = new CheckinService();
