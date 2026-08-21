import { RaftResponse } from "@uw-datasci/raft";
import { raftService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { parseRaftFilters } from "@/lib/raft/parseFilters";

/**
 * GET /api/raft/errors
 * Returns paginated error groups or occurrences within a group.
 */
export const GET = withAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const filters = parseRaftFilters(searchParams);
  const result = await raftService.getErrorGroups(filters);
  return RaftResponse.ok(result);
});
