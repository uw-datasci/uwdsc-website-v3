import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { isDateWindowOpen } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";
import { createResumeService } from "@/lib/services";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const term = await applicationService.getActiveTerm();
  if (!term) return RaftResponse.notFound("No active application period");
  if (!isDateWindowOpen(term.application_release_date, term.application_hard_deadline)) {
    return RaftResponse.forbidden("The application period is closed.");
  }

  const resumeService = await createResumeService();
  const url = await resumeService.getResumeUrl(user.id);

  return RaftResponse.ok({ hasResume: Boolean(url), url });
});

export const POST = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const term = await applicationService.getActiveTerm();
  if (!term) return RaftResponse.notFound("No active application period");
  if (!isDateWindowOpen(term.application_release_date, term.application_hard_deadline)) {
    return RaftResponse.forbidden("The application period is closed.");
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !(file instanceof File)) return RaftResponse.badRequest("No file provided");

  const resumeService = await createResumeService();
  const result = await resumeService.uploadResume({ file, userId: user.id });

  if (!result.success) return RaftResponse.badRequest(result.error, "Upload failed");

  return RaftResponse.ok({
    message: "Upload successful",
    key: result.key,
    url: result.key
  });
});
