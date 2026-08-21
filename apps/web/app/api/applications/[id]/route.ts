import { isApplicationWindowOpen } from "@uwdsc/common/utils";
import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute, type RouteContext } from "@uwdsc/core/http";
import { tryGetCurrentUser } from "@/lib/api/utils";
import { applicationService } from "@uwdsc/core";

export const PATCH = withRaftRoute(
  async (request, { params }: RouteContext<{ id: string }>) => {
    const { user, isUnauthorized } = await tryGetCurrentUser();
    if (!user) return isUnauthorized;

    const term = await applicationService.getActiveTerm();
    if (!term) return RaftResponse.notFound("No active application period");
    if (!isApplicationWindowOpen(term)) {
      return RaftResponse.forbidden("The application period is closed.");
    }

    const { id } = await params;
    if (!id) return RaftResponse.badRequest("Application ID is required");

    const body = await request.json();
    const application = await applicationService.updateApplication(id, user.id, body);

    if (!application) return RaftResponse.notFound("Application failed to update");

    return RaftResponse.ok(application);
  }
);
