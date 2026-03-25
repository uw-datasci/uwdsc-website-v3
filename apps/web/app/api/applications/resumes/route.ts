import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { createResumeService } from "@/lib/services";
import { NextRequest } from "next/server";

export async function GET(): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const resumeService = await createResumeService();
    const url = await resumeService.getResumeUrl(user.id);

    return ApiResponse.ok({
      hasResume: Boolean(url),
      url,
    });
  } catch (error) {
    console.error("Error fetching resume status:", error);
    return ApiResponse.serverError(error, "Failed to fetch resume status");
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File)) {
      return ApiResponse.badRequest("No file provided");
    }

    const resumeService = await createResumeService();
    const result = await resumeService.uploadResume({ file, userId: user.id });

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Upload failed");
    }

    return ApiResponse.ok({
      message: "Upload successful",
      key: result.key,
      url: result.key,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return ApiResponse.serverError(error, "Failed to upload resume");
  }
}
