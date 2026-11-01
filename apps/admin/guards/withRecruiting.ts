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

/** Overview: anyone with recruiting access once leadership is locked. */
export const requireOverview: WithRecruitingOptions = {
  require: (caps) =>
    caps.tabs.overview.enabled ? null : (caps.tabs.overview.reason ?? "Recruiting is locked"),
};

/** Leadership routes: presidents, once a cycle exists and until it's finalized. */
export const requireLeadership: WithRecruitingOptions = {
  require: (caps) =>
    caps.cycle && caps.can.editLeadership ? null : "Only presidents can edit leadership",
};

/** Setup routes: presidents and VPs once leadership is locked. */
export const requireSetup: WithRecruitingOptions = {
  require: (caps) =>
    caps.tabs.setup.enabled ? null : (caps.tabs.setup.reason ?? "Setup is locked"),
};

/** Board, candidate and note routes: presidents and VPs once leadership is locked. */
export const requireBoard: WithRecruitingOptions = {
  require: (caps) =>
    caps.tabs.board.enabled ? null : (caps.tabs.board.reason ?? "The board is locked"),
};

/** Offer and rejection routes: presidents while the cycle is active. */
export const requireOffers: WithRecruitingOptions = {
  require: (caps) => (caps.can.sendOffers ? null : "Only presidents can send offers"),
};

/** Finalize routes: presidents once leadership is locked (also after finalizing, to read). */
export const requireFinalize: WithRecruitingOptions = {
  require: (caps) =>
    caps.tabs.finalize.enabled ? null : (caps.tabs.finalize.reason ?? "Presidents only"),
};
