import { ApiResponse } from "@uwdsc/common/utils";
import { eventService, profileService } from "@uwdsc/core";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { WRAPPED_SLIDES } from "@/components/wrapped/slides";
import type { WrappedEvent } from "@uwdsc/common/types";
import type { HeroSlideData, WrappedSlideData } from "@/components/wrapped/types";

/**
 * GET /api/wrapped
 * Authenticated endpoint for DSC Wrapped slide data.
 */
export async function GET(): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const [events, profileStats] = await Promise.all([
      eventService.getWrappedEventStats(user.id),
      profileService.getWrappedProfileStats(user.id),
    ]);

    return ApiResponse.ok({
      slides: buildWrappedSlides({
        events,
        memberSince: profileStats?.created_at,
        passwordResetCount: profileStats?.password_reset_count ?? 0,
      }),
    });
  } catch (error: unknown) {
    console.error("Error fetching wrapped slides:", error);
    return ApiResponse.serverError(error, "Failed to fetch wrapped slides");
  }
}

/** Swatch colors cycled across the nutshell rows, matching the Figma palette. */
const NUTSHELL_COLORS = ["#9cd8ea", "#ff8f64", "#ff7075", "#ccda96", "#e6c6e0"];

interface WrappedSlideInputs {
  readonly events: readonly WrappedEvent[];
  readonly memberSince?: string;
  readonly passwordResetCount: number;
}

function buildWrappedSlides({
  events,
  memberSince,
  passwordResetCount,
}: WrappedSlideInputs): WrappedSlideData[] {
  const now = Date.now();
  // Query returns oldest → newest, so order-dependent stats need no re-sort.
  const pastEvents = events.filter((event) => Date.parse(event.start_time) <= now);
  const attendedEvents = pastEvents.filter((event) => event.attended_by_user);
  const longestStreak = getLongestAttendanceStreak(pastEvents);
  const highestAttendanceEvent = getHighestAttendanceEvent(pastEvents);
  const topAttendedEvents = [...attendedEvents]
    .sort((a, b) => b.attendance_count - a.attendance_count)
    .slice(0, 5);

  return WRAPPED_SLIDES.map((slide): WrappedSlideData => {
    switch (slide.layout) {
      case "events-nutshell":
        return {
          ...slide,
          events: topAttendedEvents.map((event, index) => ({
            id: event.id,
            name: event.name,
            description: event.description,
            color: NUTSHELL_COLORS[index % NUTSHELL_COLORS.length] ?? "#9cd8ea",
          })),
          statValue: String(attendedEvents.length),
        };
      case "streak":
        return {
          ...slide,
          captionLines: [
            `${longestStreak} event${longestStreak === 1 ? "" : "s"} in a row`,
            "without missing a beat",
          ],
        };
      case "membership":
        return {
          ...slide,
          joinDate: formatJoinDate(memberSince),
          headline: `${termsSince(memberSince)} terms since then as a member!`,
          caption: `${daysSince(memberSince).toLocaleString()} days with us!`,
        };
      case "hero":
        return buildHeroSlide(slide, { passwordResetCount, highestAttendanceEvent });
    }
  });
}

function buildHeroSlide(
  slide: HeroSlideData,
  stats: {
    passwordResetCount: number;
    highestAttendanceEvent: WrappedEvent | null;
  },
): HeroSlideData {
  switch (slide.id) {
    case "password-resets":
      return { ...slide, stat: String(stats.passwordResetCount) };
    case "club-highest-attendance":
      return stats.highestAttendanceEvent
        ? {
            ...slide,
            stat: String(stats.highestAttendanceEvent.attendance_count),
            subtitle: `${stats.highestAttendanceEvent.name} packed the room.`,
          }
        : slide;
    default:
      return slide;
  }
}

function getLongestAttendanceStreak(pastEvents: readonly WrappedEvent[]): number {
  let current = 0;
  let longest = 0;

  for (const event of pastEvents) {
    current = event.attended_by_user ? current + 1 : 0;
    longest = Math.max(longest, current);
  }

  return longest;
}

function getHighestAttendanceEvent(
  events: readonly WrappedEvent[],
): WrappedEvent | null {
  const highest = events.reduce<WrappedEvent | null>((highest, event) => {
    if (!highest || event.attendance_count > highest.attendance_count) return event;
    return highest;
  }, null);

  return highest && highest.attendance_count > 0 ? highest : null;
}

function formatJoinDate(memberSince?: string): string {
  const joinedAt = memberSince ? Date.parse(memberSince) : Number.NaN;
  if (Number.isNaN(joinedAt)) return "Day one";

  return new Date(joinedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function daysSince(memberSince?: string): number {
  const joinedAt = memberSince ? Date.parse(memberSince) : Number.NaN;
  if (Number.isNaN(joinedAt)) return 0;

  return Math.max(0, Math.floor((Date.now() - joinedAt) / 86_400_000));
}

/** Waterloo terms are ~4 months; a brand-new member is in their 1st term. */
function termsSince(memberSince?: string): number {
  return Math.max(1, Math.floor(daysSince(memberSince) / 120));
}
