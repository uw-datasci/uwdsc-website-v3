import { RaftResponse } from "@uw-datasci/raft";
import { updatePositionSchema } from "@uwdsc/common/schemas";
import { setupService } from "@uwdsc/admin";
import { requireSetup, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/recruiting/setup/positions/:id
 * Open/close a cycle position or change its openings (presidents).
 */
export const PATCH = withRecruiting<Params>(async (request, { params }, _user, recruiting) => {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return RaftResponse.badRequest("Invalid position id");

  const parsed = updatePositionSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await setupService.updatePosition(recruiting, id, parsed.data);
  return RaftResponse.ok({ saved: true });
}, requireSetup);
