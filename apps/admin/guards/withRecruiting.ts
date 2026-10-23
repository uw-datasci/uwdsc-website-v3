import type { User } from "@supabase/supabase-js";
import { RaftResponse } from "@uw-datasci/raft";
import type { RaftRouteHandler } from "@uwdsc/core/http";
import { readRoleClaims } from "@uwdsc/common/constants";
import type { RecruitingCapabilities } from "@uwdsc/common/recruiting";
import { recruitingService } from "@uwdsc/admin";
import { withAuth, type WithAuthContext } from "./withAuth";

export type WithRecruitingHandler<C extends WithAuthContext = WithAuthContext> = (
  request: Request,
  context: C,
  user: User,
  recruiting: RecruitingCapabilities
) => Promise<Response> | Response;

export interface WithRecruitingOptions {
  require?: (capabilities: RecruitingCapabilities) => string | null;
}

/**
 * Guard for every Recruiting API route. Requires a VP (`admin`) or president
 * (`pres`), loads the viewer's capabilities for the current hiring cycle, and passes
 * them to the handler so routes check `recruiting.can.*` instead of roles.
 *
 * Inherits Raft error quarantine from {@link withAuth}.
 */
export function withRecruiting<C extends WithAuthContext = WithAuthContext>(
  handler: WithRecruitingHandler<C>,
  options: WithRecruitingOptions = {}
): RaftRouteHandler<C> {
  return withAuth<C>(async (request, context, user) => {
    const recruiting = await recruitingService.getContext(readRoleClaims(user.app_metadata));
    if (!recruiting) {
      return RaftResponse.forbidden("Recruiting is only available to VPs and presidents");
    }

    const denied = options.require?.(recruiting);
    if (denied) return RaftResponse.forbidden(denied);

    return handler(request, context, user, recruiting);
  });
}

/** Leadership routes: presidents, once a cycle exists and until it's finalized. */
export const requireLeadership: WithRecruitingOptions = {
  require: (caps) =>
    caps.cycle && caps.can.editLeadership ? null : "Only presidents can edit leadership",
};
