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
    console.error("Error fetching onboarding submission:", error);
    return ApiResponse.serverError(
      error,
      "Failed to fetch onboarding submission",
    );
  }
});

export const POST = withAuth(async (request, _context, user) => {
  try {
    const body = await request.json();

    const submission = await onboardingService.saveSubmission(body, user.id);

    return ApiResponse.ok(submission);
  } catch (error: unknown) {
    console.error("Error submitting onboarding form:", error);
    return ApiResponse.serverError(error, "Failed to submit onboarding form");
  }
});
