import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export async function GET() {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const profile = await applicationService.getProfileAutofill(user.id);
    return ApiResponse.ok(profile);
  } catch (error) {
    console.error("Error fetching profile autofill:", error);
    return ApiResponse.serverError(error, "Failed to fetch profile");
  }
}
