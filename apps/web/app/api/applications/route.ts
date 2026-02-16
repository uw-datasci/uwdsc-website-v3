import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const { searchParams } = new URL(request.url);
    const termId = searchParams.get("termId");
    if (!termId) return ApiResponse.badRequest("termId is required");

    const application = await applicationService.getApplicationForUser(
      user.id,
      termId,
    );
    return ApiResponse.ok(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return ApiResponse.serverError(error, "Failed to fetch application");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const body = await request.json();
    const { termId } = body;
    if (!termId) {
      return ApiResponse.badRequest("termId is required");
    }

    const application = await applicationService.createApplication(
      user.id,
      termId,
    );
    return ApiResponse.ok(application);
  } catch (error) {
    console.error("Error creating application:", error);
    return ApiResponse.serverError(error, "Failed to create application");
  }
}
