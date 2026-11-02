import { RaftResponse } from "@uw-datasci/raft";
import { moveCardSchema } from "@uwdsc/common/schemas";
import { boardService } from "@uwdsc/admin";
import { requireBoard, withRecruiting } from "@/guards/withRecruiting";
import { recruitingIdSchema } from "@/lib/schemas/recruiting";
import type { WithAuthContext } from "@/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/recruiting/selections/:id
 * Change a card's review status. Applies the shared status rules and logs the move.
 */
export const PATCH = withRecruiting<Params>(async (request, { params }, user, recruiting) => {
  const { id } = await params;
  if (!recruitingIdSchema.safeParse(id).success)
    return RaftResponse.badRequest("Invalid card id");

  const parsed = moveCardSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await boardService.move(recruiting, user.id, id, parsed.data);
  return RaftResponse.ok({ moved: true });
}, requireBoard);
