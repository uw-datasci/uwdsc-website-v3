import { ApiError } from "@uwdsc/common/types";
import { ApiResponse } from "@uwdsc/common/utils";
import { onboardingService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

export const GET = withAuth(async (request, _context, user) => {
  try {
    const termId = new URL(request.url).searchParams.get("termId");

    if (!termId) {
      return ApiResponse.badRequest("termId is required");
    }

    const submission = await onboardingService.getSubmission(user.id, termId);

    return ApiResponse.ok(submission);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      if (error.statusCode === 403) {
        return ApiResponse.forbidden(error.message, error.code ?? error.message);
      }
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error fetching onboarding submission:", error);
    return ApiResponse.serverError(error, "Failed to fetch onboarding submission");
  }
});

export const POST = withAuth(async (request, _context, user) => {
  try {
    const body = await request.json();

    const submission = await onboardingService.saveSubmission(body, user.id);

    return ApiResponse.ok(submission);
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      if (error.statusCode === 403) {
        return ApiResponse.forbidden(error.message, error.code ?? error.message);
      }
      return ApiResponse.json(
        { error: error.message, message: error.message },
        error.statusCode,
      );
    }
    console.error("Error submitting onboarding form:", error);
    return ApiResponse.serverError(error, "Failed to submit onboarding form");
  }
});
