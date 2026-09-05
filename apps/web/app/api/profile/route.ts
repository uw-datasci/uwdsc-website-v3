import {
  tryGetCurrentUser,
  validateBaseProfileFields,
  trimBaseProfilePayload,
} from "@/lib/api/utils";
import { profileService } from "@uwdsc/core";
import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { isProfileComplete } from "@uwdsc/common/utils";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const profile = await profileService.getProfileByUserId(user.id);
  if (!profile) return RaftResponse.notFound("Profile not found");

  const isComplete = isProfileComplete(profile);
  return RaftResponse.ok({ profile, isComplete });
});

// PUT - complete profile (post-verification); requires heard_from_where
export const PUT = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const body = (await request.json()) as Record<string, unknown>;
  const validationError = validateBaseProfileFields(body);
  if (validationError) return RaftResponse.badRequest(validationError.error);

  if (typeof body.heard_from_where !== "string" || !body.heard_from_where.trim()) {
    return RaftResponse.badRequest("heard_from_where is required and must be non-empty");
  }

  const base = trimBaseProfilePayload(body);
  const result = await profileService.completeProfile(user.id, {
    ...base,
    heard_from_where: body.heard_from_where.trim(),
    is_math_soc_member: base.faculty === "math",
  });
  if (!result.success) {
    return RaftResponse.badRequest("Failed to complete profile", result.error);
  }

  return RaftResponse.ok({ success: true });
});

// PATCH - update profile; no heard_from_where
export const PATCH = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const body = (await request.json()) as Record<string, unknown>;
  const validationError = validateBaseProfileFields(body);
  if (validationError) return RaftResponse.badRequest(validationError.error);

  const base = trimBaseProfilePayload(body);
  const result = await profileService.updateProfile(user.id, base);
  if (!result.success) return RaftResponse.badRequest("Failed to update profile", result.error);

  return RaftResponse.ok({ success: true });
});
