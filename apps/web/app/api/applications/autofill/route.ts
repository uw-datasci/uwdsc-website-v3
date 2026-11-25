import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export const GET = withRaftRoute(async () => {
  const { user, isUnauthorized } = await tryGetCurrentUser();
  if (!user) return isUnauthorized;

  const { term, open } = await applicationService.getApplyWindow();
  if (!term) return RaftResponse.notFound("No active application period");
  if (!open) return RaftResponse.forbidden("The application period is closed.");

  const profile = await applicationService.getProfileAutofill(user.id);
  return RaftResponse.ok(profile);
});
