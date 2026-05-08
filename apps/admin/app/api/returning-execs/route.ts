import { ApiResponse } from "@uwdsc/common/utils";
import { returningExecService } from "@uwdsc/admin";
import { withVpAccess } from "@/guards/withVpAccess";
import type { QuestionScope } from "@uwdsc/common/types";

/**
 * GET /api/returning-execs
 * Returns all returning-exec submissions for the active term.
 * Requires admin role + VP or president scope.
 */
export const GET = withVpAccess(async (_request, _context, user, scope: QuestionScope) => {
  if (user.app_metadata?.role !== "admin") {
    return ApiResponse.unauthorized(
      "Only users with the admin role can view returning exec submissions",
    );
  }

  try {
    const { submissions } =
      await returningExecService.getAllSubmissionsForActiveTerm();
    return ApiResponse.ok({
      submissions,
      positionReview: {
        canUse: true,
        isPresident: scope.isPresident,
        vpPositionIds: scope.vpPositionIds,
      },
    });
  } catch (error) {
    console.error("Error fetching returning exec submissions:", error);
    return ApiResponse.serverError(error, "Failed to fetch submissions");
  }
});
