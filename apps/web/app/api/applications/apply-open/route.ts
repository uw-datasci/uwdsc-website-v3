import { ApiResponse, isApplicationWindowOpen } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/core";

/** Public: whether the exec apply page should be linked in navigation. */
export async function GET(): Promise<Response> {
  try {
    const term = await applicationService.getActiveTerm();
    const open = Boolean(term && isApplicationWindowOpen(term));
    // Only expose term details while the window is open, so an unreleased
    // term's dates never leak from this unauthenticated route. The window
    // now stays open through the hard deadline, so both dates are exposed
    // together -- hardDeadline lets the UI show a grace-period countdown
    // once the (display-only) soft deadline has passed.
    return ApiResponse.ok({
      open,
      softDeadline: open ? (term?.application_soft_deadline ?? null) : null,
      hardDeadline: open ? (term?.application_hard_deadline ?? null) : null,
      termCode: open ? (term?.code ?? null) : null,
    });
  } catch (error) {
    console.error("Error checking apply page window:", error);
    return ApiResponse.serverError(error, "Failed to check apply window");
  }
}
