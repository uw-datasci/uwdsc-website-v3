import { RaftResponse } from "@uw-datasci/raft";
import { noteSchema } from "@uwdsc/common/schemas";
import { notesService } from "@uwdsc/admin";
import { requireBoard, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";
import { recruitingIdSchema } from "@/lib/schemas/recruiting";

interface Params extends WithAuthContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/recruiting/candidates/:applicationId/notes
 * The candidate's notes for this cycle, newest first.
 */
export const GET = withRecruiting<Params>(async (_request, { params }, user, recruiting) => {
  const { id } = await params;
  if (!recruitingIdSchema.safeParse(id).success) {
    return RaftResponse.badRequest("Invalid application id");
  }
  return RaftResponse.ok({ notes: await notesService.getNotes(recruiting, user.id, id) });
}, requireBoard);

/**
 * POST /api/recruiting/candidates/:applicationId/notes
 * Add a note. Visible to presidents and every VP.
 */
export const POST = withRecruiting<Params>(async (request, { params }, user, recruiting) => {
  const { id } = await params;
  if (!recruitingIdSchema.safeParse(id).success) {
    return RaftResponse.badRequest("Invalid application id");
  }

  const parsed = noteSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await notesService.addNote(recruiting, user.id, id, parsed.data);
  return RaftResponse.ok({ saved: true });
}, requireBoard);
