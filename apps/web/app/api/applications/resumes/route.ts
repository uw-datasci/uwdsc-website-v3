import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { createResumeService } from "@/lib/services";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (isUnauthorized || !user) return isUnauthorized;

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
