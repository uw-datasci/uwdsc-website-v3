import { ApiResponse } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { profileService } from "@uwdsc/core";
import { createProfilePhotoService } from "@/lib/services";
import { NextRequest } from "next/server";

export async function GET(): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const profilePhotoService = await createProfilePhotoService();
    const url = await profilePhotoService.getProfilePhotoUrl(user.id);

    return ApiResponse.ok({
      hasPhoto: Boolean(url),
      url,
    });
  } catch (error) {
    console.error("Error fetching profile photo status:", error);
    return ApiResponse.serverError(error, "Failed to fetch profile photo status");
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

    const profilePhotoService = await createProfilePhotoService();
    const result = await profilePhotoService.uploadProfilePhoto({ file, userId: user.id });

    if (!result.success) {
      return ApiResponse.badRequest(result.error, "Upload failed");
    }

    const updateResult = await profileService.updateProfilePhotoKey(user.id, result.key);
    if (!updateResult.success) {
      return ApiResponse.badRequest(updateResult.error, "Upload failed");
    }

    const url = await profilePhotoService.getProfilePhotoUrl(user.id);

    return ApiResponse.ok({
      message: "Upload successful",
      key: result.key,
      url,
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return ApiResponse.serverError(error, "Failed to upload profile photo");
  }
}

export async function DELETE(): Promise<Response> {
  try {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const profilePhotoService = await createProfilePhotoService();
    await profilePhotoService.deleteProfilePhoto(user.id);

    const updateResult = await profileService.updateProfilePhotoKey(user.id, null);
    if (!updateResult.success) {
      return ApiResponse.badRequest(updateResult.error, "Delete failed");
    }

    return ApiResponse.ok({ message: "Delete successful" });
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    return ApiResponse.serverError(error, "Failed to delete profile photo");
  }
}
