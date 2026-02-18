import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const term = await applicationService.getActiveTerm();
    if (!term) return ApiResponse.notFound("No active application period");

    return ApiResponse.ok(term);
  } catch (error) {
    console.error("Error fetching active term:", error);
    return ApiResponse.serverError(error, "Failed to fetch active term");
  }
}
