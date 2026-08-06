import { ApiResponse } from "@uwdsc/common/utils";
import { raftService } from "@uwdsc/admin";
import { withAuth, type WithAuthContext } from "@/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/raft/errors/[id]
 * Returns a single quarantined error with stack trace and metadata.
 */
export const GET = withAuth<Params>(async (_request, { params }) => {
  try {
    const { id } = await params;
    const error = await raftService.getErrorById(id);

    if (!error) return ApiResponse.notFound("Error not found");

    return ApiResponse.ok({ error });
  } catch (err: unknown) {
    console.error("Error fetching raft error:", err);
    return ApiResponse.serverError(err, "Failed to fetch raft error");
  }
});

/**
 * PATCH /api/raft/errors/[id]
 * Marks a quarantined error as resolved or unresolved.
 */
export const PATCH = withAuth<Params>(async (request, { params }) => {
  try {
    const { id } = await params;
    const body = (await request.json()) as { resolved?: boolean };

    if (typeof body.resolved !== "boolean") {
      return ApiResponse.badRequest("resolved must be a boolean");
    }

    const error = await raftService.setResolved(id, body.resolved);

    if (!error) return ApiResponse.notFound("Error not found");

    return ApiResponse.ok({ error });
  } catch (err: unknown) {
    console.error("Error updating raft error:", err);
    return ApiResponse.serverError(err, "Failed to update raft error");
  }
});
