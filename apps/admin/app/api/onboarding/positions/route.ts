import { ApiResponse } from "@uwdsc/common/utils";
import { onboardingService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";



export const GET = withAuth(async () => {
  try {
    const data = await onboardingService.getExecPositions();
    return ApiResponse.ok(data);
  } catch (error: unknown) {
    console.error("Error fetching positions:", error);
    return ApiResponse.serverError(error, "Failed to fetch positions");
  }
});
