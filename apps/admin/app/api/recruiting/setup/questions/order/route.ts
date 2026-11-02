import { RaftResponse } from "@uw-datasci/raft";
import { reorderQuestionsSchema } from "@uwdsc/common/schemas";
import { setupService } from "@uwdsc/admin";
import { requireSetup, withRecruiting } from "@/guards/withRecruiting";

/**
 * PUT /api/recruiting/setup/questions/order
 * Reorder the questions in one section (General or a position).
 */
export const PUT = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = reorderQuestionsSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await setupService.reorderQuestions(recruiting, parsed.data);
  return RaftResponse.ok({ saved: true });
}, requireSetup);
