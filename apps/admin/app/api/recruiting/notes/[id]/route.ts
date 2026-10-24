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
 * PATCH /api/recruiting/notes/:id
 * Edit your own note.
 */
export const PATCH = withRecruiting<Params>(async (request, { params }, user, recruiting) => {
  const { id } = await params;
  if (!recruitingIdSchema.safeParse(id).success)
    return RaftResponse.badRequest("Invalid note id");

  const parsed = noteSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await notesService.updateNote(recruiting, user.id, id, parsed.data);
  return RaftResponse.ok({ saved: true });
}, requireBoard);

/**
 * DELETE /api/recruiting/notes/:id
 * Soft-delete a note: your own, or anyone's for presidents.
 */
export const DELETE = withRecruiting<Params>(async (_request, { params }, user, recruiting) => {
  const { id } = await params;
  if (!recruitingIdSchema.safeParse(id).success)
    return RaftResponse.badRequest("Invalid note id");

  await notesService.deleteNote(recruiting, user.id, id);
  return RaftResponse.ok({ deleted: true });
}, requireBoard);
