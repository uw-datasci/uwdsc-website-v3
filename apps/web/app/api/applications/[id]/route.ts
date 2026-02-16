import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

    const { id } = await params;
    if (!id) return ApiResponse.badRequest("Application ID is required");

    const body = await request.json();
    const application = await applicationService.updateApplication(
      id,
      user.id,
      body,
    );

    if (!application) {
      return ApiResponse.notFound("Application not found or cannot be updated");
    }

    return ApiResponse.ok(application);
  } catch (error) {
    console.error("Error updating application:", error);
    return ApiResponse.serverError(error, "Failed to update application");
  }
}
