import { ApiResponse } from "@uwdsc/common/utils";
import { raftService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { parseRaftFilters } from "@/lib/raft/parseFilters";

/**
 * GET /api/raft/overview
 * Returns stats and chart datasets for the Raft quarantine dashboard.
 */
export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseRaftFilters(searchParams);
    const overview = await raftService.getOverview(filters);
    return ApiResponse.ok(overview);
  } catch (error: unknown) {
    console.error("Error fetching raft overview:", error);
    return ApiResponse.serverError(error, "Failed to fetch raft overview");
  }
});
