import { ApiResponse } from "@uwdsc/common/utils";
import { withAuth } from "@/guards/withAuth";
import { onboardingService } from "@uwdsc/admin";

export const GET = withAuth(async () => {
  try {
    const data = await onboardingService.getActiveTerm();
    return ApiResponse.ok(data);
  } catch (error: unknown) {
    console.error("Error fetching active term:", error);
    return ApiResponse.serverError(error, "Failed to fetch active term");
  }
});
