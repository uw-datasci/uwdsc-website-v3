import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export const GET = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const { searchParams } = new URL(request.url);
  const termId = searchParams.get("termId");
  if (!termId) return RaftResponse.badRequest("termId is required");

  const { term: activeTerm, open } = await applicationService.getApplyWindow();
  if (!activeTerm) return RaftResponse.notFound("No active application period");
  if (!open) return RaftResponse.forbidden("The application period is closed.");
  if (termId !== activeTerm.id) {
    return RaftResponse.badRequest("termId does not match active term");
  }

  const application = await applicationService.getApplicationForUser(user.id, termId);
  return RaftResponse.ok(application);
});

export const POST = withRaftRoute(async (request) => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const { term: activeTerm, open } = await applicationService.getApplyWindow();
  if (!activeTerm) return RaftResponse.notFound("No active application period");
  if (!open) return RaftResponse.forbidden("The application period is closed.");

  const body = await request.json();
  const { termId } = body;
  if (!termId) return RaftResponse.badRequest("termId is required");
  if (termId !== activeTerm.id)
    return RaftResponse.badRequest("termId does not match active term");

  const application = await applicationService.createApplication(user.id, termId);
  return RaftResponse.ok(application);
});
