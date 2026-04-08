import { ApiResponse } from "@uwdsc/common/utils";
import { eventService, profileService } from "@uwdsc/core";

function roundUpToTens(n: number): number {
  return Math.ceil(n / 10) * 10;
}

/**
 * GET /api/stats
 * Public hero metrics: member (profile) count and event count, each rounded up to the nearest 10.
 */
export async function GET(): Promise<Response> {
  try {
    const [rawMembers, rawEvents] = await Promise.all([
      profileService.getProfileCount(),
      eventService.getEventCount(),
    ]);

    return ApiResponse.ok({
      members: roundUpToTens(rawMembers),
      events: roundUpToTens(rawEvents),
    });
  } catch (error: unknown) {
    console.error("Error fetching public stats:", error);
    return ApiResponse.serverError(error, "Failed to fetch stats");
  }
}
