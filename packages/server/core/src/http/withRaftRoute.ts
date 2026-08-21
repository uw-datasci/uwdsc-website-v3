import {
  RaftClient,
  RaftResponse,
  withRaft,
  type RaftRouteContext,
  type RaftRouteHandler
} from "@uw-datasci/raft";
// This repo's ApiError, NOT the identically named class @uw-datasci/raft also
// exports. Importing raft's would make every `instanceof` check below silently
// fail, turning all 130 ApiError throws in the service layer into quarantined
// 500s with no type error to warn you.
import { ApiError } from "@uwdsc/common/types";

/**
 * Route segment params, in the shape `withRaft` constrains its context to.
 *
 * The params **payload** must be an inline object literal or a `type` alias -
 * never a named `interface`. Only anonymous object types receive TypeScript's
 * implicit index signature, which is what satisfies
 * `Record<string, string | string[]>`.
 *
 * @example
 * type Params = { id: string };      // works
 * interface Params { id: string }    // TS2344 / TS2430
 */
export type RaftRouteParams = Record<string, string | string[]>;

/** The context Next 16 passes as a route handler's second argument. */
export type RouteContext<TParams extends RaftRouteParams = RaftRouteParams> = {
  params: Promise<TParams>;
};

export type { RaftRouteContext, RaftRouteHandler };

/**
 * `withRaft` plus this repo's `ApiError` translation. Wrap every route handler
 * with this (or with a guard that already does, such as `withAuth` in the admin
 * app) instead of writing a try/catch.
 *
 * - `ApiError` with a 4xx status - mapped to that status, not quarantined.
 *   These are caller-caused and expected; matches the previous behaviour.
 * - `ApiError` with a 5xx status - mapped *and* quarantined. 89 of the 130
 *   throws in the service layer resolve to 500 (48 by omitting the argument
 *   entirely); those are real faults and must not stay invisible just because
 *   they arrive wrapped in an `ApiError`.
 * - Anything else - rethrown into `withRaft`, which quarantines it and returns
 *   a generic 500.
 * - Next control-flow throws (`redirect()`, `notFound()`) are not `ApiError`, so
 *   they reach `withRaft`, which re-throws them by digest.
 */
export function withRaftRoute<C extends RaftRouteContext = RaftRouteContext>(
  handler: RaftRouteHandler<C>
): RaftRouteHandler<C> {
  return withRaft<C>(async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;

      if (error.statusCode >= 500) {
        await RaftClient.getInstance().reportError(error, {
          route: request.nextUrl?.pathname,
          method: request.method,
          url: request.url
        });
      }

      if (error.statusCode === 403) {
        return RaftResponse.forbidden(error.message, error.code ?? error.message);
      }

      return RaftResponse.json(
        { error: error.message, message: error.message },
        error.statusCode
      );
    }
  });
}
