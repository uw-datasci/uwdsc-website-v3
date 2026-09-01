import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService as adminApplicationService } from "@uwdsc/admin";
import { applicationService as coreApplicationService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";
import { withPresAccess } from "@/guards/withPresAccess";
import { termScheduleSchema } from "@/lib/schemas/termSchedule";

/**
 * GET /api/terms/active
 * Get the active term, if any. Admin/exec only.
 */
export const GET = withAuth(async () => {
  try {
    const term = await coreApplicationService.getActiveTerm();
    return ApiResponse.ok({ term });
  } catch (error: unknown) {
    console.error("Error fetching active term:", error);
    return ApiResponse.serverError(error, "Failed to fetch active term");
  }
});

/**
 * PATCH /api/terms/active
 * Update the active term's application schedule (release date, soft
 * deadline, hard deadline). President only.
 */
export const PATCH = withPresAccess(async (request) => {
  try {
    const body = await request.json();
    const parsed = termScheduleSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(
        parsed.error.issues[0]?.message ?? "Invalid schedule payload",
      );
    }

    const term = await adminApplicationService.updateActiveTermSchedule(parsed.data);
    return ApiResponse.ok({ success: true, term });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error updating term schedule:", error);
    return ApiResponse.serverError(error, "Failed to update term schedule");
  }
});
