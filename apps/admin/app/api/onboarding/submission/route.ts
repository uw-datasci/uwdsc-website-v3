import { ApiResponse } from "@uwdsc/common/utils";
import { onboardingService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";


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