import { eventService as coreEventService } from "@uwdsc/core";

export interface CheckInOutcome {
  checked_in: boolean;
  check_in_error?: string;
}

/**
 * Best-effort check-in performed alongside granting a membership.
 *
 * Granting the membership is the critical action, so a failure here never fails
 * the request — it is surfaced to the UI via `check_in_error` instead.
 * Re-validates the active window server-side (the client-fetched active event
 * may have lapsed between page load and submit).
 *
 * Shared by the manual mark-as-paid route and the online submission review
 * route so both behave identically.
 */
export async function tryCheckInAtEvent(
  eventId: string,
  profileId: string
): Promise<CheckInOutcome> {
  try {
    const event = await coreEventService.getEventById(eventId);
    if (!event) return { checked_in: false, check_in_error: "Event not found." };

    const now = new Date();
    const bufferedStart = new Date(event.buffered_start_time);
    const bufferedEnd = new Date(event.buffered_end_time);
    if (now < bufferedStart || now > bufferedEnd) {
      return { checked_in: false, check_in_error: "Check-in no longer open" };
    }

    const inserted = await coreEventService.checkInUser(eventId, profileId);
    if (inserted) return { checked_in: true };

    // No row inserted: either already checked in (treat as success) or a
    // transient conflict. Confirm via attendance lookup.
    const { checkedIn } = await coreEventService.getAttendanceForUser(eventId, profileId);
    return checkedIn
      ? { checked_in: true }
      : { checked_in: false, check_in_error: "Could not check" };
  } catch (error) {
    console.error("Error checking member in:", error);
    return { checked_in: false, check_in_error: "Could not check the member in." };
  }
}
