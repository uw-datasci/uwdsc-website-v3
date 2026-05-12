import { ApiResponse, isApplicationApiWindowOpen } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export async function GET(): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const term = await applicationService.getActiveTerm();
    if (!term) return ApiResponse.notFound("No active application period");
    if (!isApplicationApiWindowOpen(term)) {
      return ApiResponse.forbidden(
        "The application period is closed.",
        "The application period is closed.",
      );
    }

    const profile = await applicationService.getProfileAutofill(user.id);
    return ApiResponse.ok(profile);
  } catch (error) {
    console.error("Error fetching profile autofill:", error);
    return ApiResponse.serverError(error, "Failed to fetch profile");
  }
}
