import { RaftResponse } from "@uw-datasci/raft";
import { raftService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { parseRaftFilters } from "@/lib/raft/parseFilters";

/**
 * GET /api/raft/overview
 * Returns stats and chart datasets for the Raft quarantine dashboard.
 */
export const GET = withAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const filters = parseRaftFilters(searchParams);
  const overview = await raftService.getOverview(filters);
  return RaftResponse.ok(overview);
});
