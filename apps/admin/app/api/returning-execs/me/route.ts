import { ApiError, type ReturningExecSubmissionData } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { returningExecService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/returning-execs/me
 * Returns the current user's returning-exec submission for the active term, or null.
 */
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const submission = await returningExecService.getOwnSubmission(user.id);
    return ApiResponse.ok({ submission });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 403) {
        return ApiResponse.forbidden(error.message, error.code ?? error.message);
      }
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error fetching returning exec submission:", error);
    return ApiResponse.serverError(error, "Failed to fetch submission");
  }
});

/**
 * PUT /api/returning-execs/me
 * Upsert the current user's returning-exec submission for the active term.
 */
export const PUT = withAuth(async (request, _context, user) => {
  try {
    const body = (await request.json()) as ReturningExecSubmissionData;
    const submission = await returningExecService.upsertSubmission(user.id, body);
    return ApiResponse.ok({ submission });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 403) {
        return ApiResponse.forbidden(error.message, error.code ?? error.message);
      }
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error saving returning exec submission:", error);
    return ApiResponse.serverError(error, "Failed to save submission");
  }
});
