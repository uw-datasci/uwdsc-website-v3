import { ApiResponse } from "@uwdsc/common/utils";
import { createHeadshotService } from "@/lib/services";
import { withAuth } from "@/guards/withAuth";

export const POST = withAuth(async (request, _context, user) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fullName = formData.get("fullName") as string | null;

    if (!file || !(file instanceof File)) {
      return ApiResponse.badRequest("No file provided");
    }

    if (!fullName?.trim()) {
      return ApiResponse.badRequest("fullName is required");
    }

    const headshotService = await createHeadshotService();
    const result = await headshotService.uploadHeadshot({
      file,
      userId: user.id,
      fullName,
    });

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Upload failed");
    }

    return ApiResponse.ok({
      message: "Upload successful",
      key: result.key,
      url: result.key,
    });
  } catch (error) {
    console.error("Error uploading headshot:", error);
    return ApiResponse.serverError(error, "Failed to upload headshot");
  }
});