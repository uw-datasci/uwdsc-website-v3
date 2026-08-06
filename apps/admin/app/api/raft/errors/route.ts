import { ApiResponse } from "@uwdsc/common/utils";
import { raftService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { parseRaftFilters } from "@/lib/raft/parseFilters";

/**
 * GET /api/raft/errors
 * Returns paginated error groups or occurrences within a group.
 */
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseRaftFilters(searchParams);
    const result = await raftService.getErrorGroups(filters);
    return ApiResponse.ok(result);
  } catch (error: unknown) {
    console.error("Error fetching raft errors:", error);
    return ApiResponse.serverError(error, "Failed to fetch raft errors");
  }
});
