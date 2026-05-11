import { ApiResponse, isApplicationApiWindowOpen } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const { searchParams } = new URL(request.url);
    const termId = searchParams.get("termId");
    if (!termId) return ApiResponse.badRequest("termId is required");

    const activeTerm = await applicationService.getActiveTerm();
    if (!activeTerm) return ApiResponse.notFound("No active application period");
    if (!isApplicationApiWindowOpen(activeTerm)) {
      return ApiResponse.json(
        {
          error: "The application period is closed.",
          message: "The application period is closed.",
        },
        403,
      );
    }
    if (termId !== activeTerm.id) {
      return ApiResponse.badRequest("termId does not match active term");
    }

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

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const activeTerm = await applicationService.getActiveTerm();
    if (!activeTerm) return ApiResponse.notFound("No active application period");
    if (!isApplicationApiWindowOpen(activeTerm)) {
      return ApiResponse.json(
        {
          error: "The application period is closed.",
          message: "The application period is closed.",
        },
        403,
      );
    }

    const body = await request.json();
    const { termId } = body;
    if (!termId) {
      return ApiResponse.badRequest("termId is required");
    }
    if (termId !== activeTerm.id) {
      return ApiResponse.badRequest("termId does not match active term");
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
