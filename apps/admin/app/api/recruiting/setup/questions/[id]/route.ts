import { RaftResponse } from "@uw-datasci/raft";
import { updateQuestionSchema } from "@uwdsc/common/schemas";
import { setupService } from "@uwdsc/admin";
import { requireSetup, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/recruiting/setup/questions/:id
 * Edit a question, or archive/restore it with `{ archived }`.
 */
export const PATCH = withRecruiting<Params>(async (request, { params }, _user, recruiting) => {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return RaftResponse.badRequest("Invalid question id");

  const parsed = updateQuestionSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await setupService.updateQuestion(recruiting, id, parsed.data);
  return RaftResponse.ok({ saved: true });
}, requireSetup);
