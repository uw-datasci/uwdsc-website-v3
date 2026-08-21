import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { isDateWindowOpen } from "@uwdsc/common/utils";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export const GET = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const { searchParams } = new URL(request.url);
  const termId = searchParams.get("termId");
  if (!termId) return RaftResponse.badRequest("termId is required");

  const activeTerm = await applicationService.getActiveTerm();
  if (!activeTerm) return RaftResponse.notFound("No active application period");
  if (!isDateWindowOpen(activeTerm.application_release_date, activeTerm.application_hard_deadline)) {
    return RaftResponse.forbidden("The application period is closed.");
  }
  if (termId !== activeTerm.id) {
    return RaftResponse.badRequest("termId does not match active term");
  }

  const application = await applicationService.getApplicationForUser(user.id, termId);
  return RaftResponse.ok(application);
});

export const POST = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const activeTerm = await applicationService.getActiveTerm();
  if (!activeTerm) return RaftResponse.notFound("No active application period");
  if (!isDateWindowOpen(activeTerm.application_release_date, activeTerm.application_hard_deadline)) {
    return RaftResponse.forbidden("The application period is closed.");
  }

  const body = await request.json();
  const { termId } = body;
  if (!termId) return RaftResponse.badRequest("termId is required");
  if (termId !== activeTerm.id) return RaftResponse.badRequest("termId does not match active term");

  const application = await applicationService.createApplication(user.id, termId);
  return RaftResponse.ok(application);
});
