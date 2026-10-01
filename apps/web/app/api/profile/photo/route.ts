import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { profileService } from "@uwdsc/core";
import { createProfilePhotoService } from "@/lib/services";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const profile = await profileService.getProfileByUserId(user.id);
  const key = profile?.profile_photo_key ?? null;

  let url: string | null = null;
  if (key) {
    const profilePhotoService = await createProfilePhotoService();
    url = await profilePhotoService.getSignedUrlForKey(key);
  }

  return RaftResponse.ok({ hasPhoto: Boolean(key), key, url });
});

export const POST = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return RaftResponse.badRequest("No file provided");
  }

  const profilePhotoService = await createProfilePhotoService();
  const result = await profilePhotoService.uploadProfilePhoto({ file, userId: user.id });
  if (!result.success) return RaftResponse.badRequest(result.error, "Upload failed");

  const updateResult = await profileService.updateProfilePhotoKey(user.id, result.key);
  if (!updateResult.success)
    return RaftResponse.badRequest(updateResult.error, "Upload failed");

  return RaftResponse.ok({ message: "Upload successful", key: result.key });
});

export const DELETE = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const profilePhotoService = await createProfilePhotoService();
  await profilePhotoService.deleteProfilePhoto(user.id);

  const updateResult = await profileService.updateProfilePhotoKey(user.id, null);
  if (!updateResult.success)
    return RaftResponse.badRequest(updateResult.error, "Delete failed");

  return RaftResponse.ok({ message: "Delete successful" });
});
