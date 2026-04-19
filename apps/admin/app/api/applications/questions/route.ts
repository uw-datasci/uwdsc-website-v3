import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withVpAccess } from "@/guards/withVpAccess";
import { questionSchema } from "@/lib/schemas/questions";

/**
 * GET /api/applications/questions
 * List all questions within the VP's allowed scope.
 */
export const GET = withVpAccess(async (_request, _context, _user, scope) => {
  try {
    const [questions, positions] = await Promise.all([
      applicationService.getQuestionsForScope(scope),
      applicationService.getPositionOptionsForScope(scope),
    ]);
    return ApiResponse.ok({
      questions,
      positions,
      scope: {
        isPresident: scope.isPresident,
        hasVpExecRole: scope.hasVpExecRole,
        vpSubteamNames: scope.vpSubteamNames,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching scoped application questions:", error);
    return ApiResponse.serverError(error, "Failed to fetch questions");
  }
});

/**
 * POST /api/applications/questions
 * Create a new question mapped to an allowed position.
 */
export const POST = withVpAccess(async (request, _context, _user, scope) => {
  try {
    const body = await request.json();
    const parsed = questionSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.badRequest(
        parsed.error.issues[0]?.message ?? "Invalid question payload",
      );
    }

    const created = await applicationService.createQuestion(scope, parsed.data);
    return ApiResponse.ok({ success: true, question: created });
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error creating scoped application question:", error);
    return ApiResponse.serverError(error, "Failed to create question");
  }
});
