import { ApiResponse } from "@uwdsc/common/utils";
import { eventService, profileService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { WRAPPED_SLIDES } from "@/components/wrapped/slides";
import type { Event, EventWithAttendanceCount } from "@uwdsc/common/types";
import type { WrappedSlideData } from "@/components/wrapped/types";

/**
 * GET /api/wrapped
 * Authenticated endpoint for DSC Wrapped slide data.
 */
export async function GET(): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const [attendedEvents, allEvents, eventsWithAttendance, profileStats] =
      await Promise.all([
        eventService.getEventsAttendedByUser(user.id),
        eventService.getAllEvents(),
        eventService.getAllEventsWithAttendanceCount(),
        profileService.getWrappedProfileStats(user.id),
      ]);

    return ApiResponse.ok({
      slides: buildWrappedSlides({
        attendedEvents,
        allEvents,
        eventsWithAttendance,
        memberSince: profileStats?.created_at,
        passwordResetCount: profileStats?.password_reset_count ?? 0,
      }),
    });
  } catch (error: unknown) {
    console.error("Error fetching wrapped slides:", error);
    return ApiResponse.serverError(error, "Failed to fetch wrapped slides");
  }
}

interface WrappedSlideInputs {
  readonly attendedEvents: readonly Event[];
  readonly allEvents: readonly Event[];
  readonly eventsWithAttendance: readonly EventWithAttendanceCount[];
  readonly memberSince?: string;
  readonly passwordResetCount: number;
}

function buildWrappedSlides({
  attendedEvents,
  allEvents,
  eventsWithAttendance,
  memberSince,
  passwordResetCount,
}: WrappedSlideInputs): WrappedSlideData[] {
  const attendedCount = attendedEvents.length;
  const longestStreak = getLongestAttendanceStreak(allEvents, attendedEvents);
  const highestAttendanceEvent = getHighestAttendanceEvent(eventsWithAttendance);

  return WRAPPED_SLIDES.map((slide) => {
    switch (slide.id) {
      case "events":
        return {
          ...slide,
          stat: String(attendedCount),
        };
      case "streak":
        return {
          ...slide,
          stat: String(longestStreak),
        };
      case "membership":
        return {
          ...slide,
          stat: formatMemberFor(memberSince),
        };
      case "password-resets":
        return {
          ...slide,
          stat: String(passwordResetCount),
        };
      case "club-highest-attendance":
        return {
          ...slide,
          stat: String(highestAttendanceEvent?.attendance_count ?? 0),
          subtitle: highestAttendanceEvent
            ? `${highestAttendanceEvent.name} packed the room.`
            : slide.subtitle,
        };
      default:
        return slide;
    }
  });
}

function getLongestAttendanceStreak(
  allEvents: readonly Event[],
  attendedEvents: readonly Event[],
): number {
  const attendedIds = new Set(attendedEvents.map((event) => event.id));
  const now = Date.now();
  const pastEvents = [...allEvents]
    .filter((event) => Date.parse(event.start_time) <= now)
    .sort((a, b) => Date.parse(a.start_time) - Date.parse(b.start_time));

  let current = 0;
  let longest = 0;

  for (const event of pastEvents) {
    if (attendedIds.has(event.id)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function getHighestAttendanceEvent(
  events: readonly EventWithAttendanceCount[],
): EventWithAttendanceCount | null {
  const highest = events.reduce<EventWithAttendanceCount | null>((highest, event) => {
    if (!highest || event.attendance_count > highest.attendance_count) return event;
    return highest;
  }, null);

  return highest && highest.attendance_count > 0 ? highest : null;
}

function formatMemberFor(memberSince?: string): string {
  if (!memberSince) return "0 yrs";

  const joinedAt = Date.parse(memberSince);
  if (Number.isNaN(joinedAt)) return "0 yrs";

  const days = Math.max(0, Math.floor((Date.now() - joinedAt) / 86_400_000));
  if (days < 30) return `${days} day${days === 1 ? "" : "s"}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo`;

  const years = Math.floor(months / 12);
  return `${years} yr${years === 1 ? "" : "s"}`;
}
