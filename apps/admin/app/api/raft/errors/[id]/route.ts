import { RaftResponse } from "@uw-datasci/raft";
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
  const { id } = await params;
  const error = await raftService.getErrorById(id);

  if (!error) return RaftResponse.notFound("Error not found");

  return RaftResponse.ok({ error });
});

/**
 * PATCH /api/raft/errors/[id]
 * Marks a quarantined error as resolved or unresolved.
 */
export const PATCH = withAuth<Params>(async (request, { params }) => {
  const { id } = await params;
  const body = (await request.json()) as { resolved?: boolean };

  if (typeof body.resolved !== "boolean") {
    return RaftResponse.badRequest("resolved must be a boolean");
  }

  const error = await raftService.setResolved(id, body.resolved);

  if (!error) return RaftResponse.notFound("Error not found");

  return RaftResponse.ok({ error });
});
