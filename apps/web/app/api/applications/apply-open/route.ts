import { ApiResponse, isApplicationPageWindowOpen } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/core";

/** Public: whether the exec apply page should be linked in navigation. */
export async function GET(): Promise<Response> {
  try {
    const term = await applicationService.getActiveTerm();
    const open = Boolean(term && isApplicationPageWindowOpen(term));
    return ApiResponse.ok({ open });
  } catch (error) {
    console.error("Error checking apply page window:", error);
    return ApiResponse.serverError(error, "Failed to check apply window");
  }
}
