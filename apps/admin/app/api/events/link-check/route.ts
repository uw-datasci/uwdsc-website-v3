import { RaftResponse } from "@uw-datasci/raft";
import { linkCheckService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * POST /api/events/link-check
 * Advisory-only reachability probe for a workshop resource link (typically a Notion page).
 * Never blocks saving an event -- see linkCheckService for why this can only ever be a hint.
 * Admin/exec only.
 */
export const POST = withAuth(async (request) => {
  const body = await request.json();
  const url = typeof body?.url === "string" ? body.url : "";

  if (!url) {
    return RaftResponse.badRequest("url is required", "Validation error");
  }

  const result = await linkCheckService.check(url);
  return RaftResponse.ok(result);
});
