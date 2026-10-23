import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute, type RouteContext } from "@uwdsc/core/http";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export const PATCH = withRaftRoute(
  async (request, { params }: RouteContext<{ id: string }>) => {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const { term, cycleId, open } = await applicationService.getApplyWindow();
    if (!term) return RaftResponse.notFound("No active application period");
    if (!open || !cycleId) return RaftResponse.forbidden("The application period is closed.");

    const { id } = await params;
    if (!id) return RaftResponse.badRequest("Application ID is required");

    const body = await request.json();
    const application = await applicationService.updateApplication(
      id,
      user.id,
      term.id,
      cycleId,
      body
    );

    if (!application) return RaftResponse.notFound("Application failed to update");

    return RaftResponse.ok(application);
  }
);
