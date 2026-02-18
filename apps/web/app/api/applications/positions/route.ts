import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const data = await applicationService.getPositionsWithQuestions();
    return ApiResponse.ok(data);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return ApiResponse.serverError(error, "Failed to fetch positions");
  }
}
