import type { RecruitingCapabilities, RecruitingCycleSummary } from "@uwdsc/common/recruiting";
import type { NoteInput } from "@uwdsc/common/schemas";
import type { ActivityItem, NoteView } from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { CandidateRepository, type CandidateRow } from "./candidate.repository";
import { NotesRepository } from "./notes.repository";

type Capabilities = Pick<RecruitingCapabilities, "viewer" | "cycle">;

/** The author tag stored with a note: "President" or "VP, Events". */
function roleLabel(viewer: Capabilities["viewer"]): string {
  if (viewer.role === "pres") return "President";
  return viewer.subteamName ? `VP, ${viewer.subteamName}` : "VP";
}

/** Notes are per candidate per cycle, shared across all their positions. */
class NotesService {
  private readonly repository = new NotesRepository();
  private readonly candidates = new CandidateRepository();

  async getNotes(
    caps: Capabilities,
    actorId: string,
    applicationId: string
  ): Promise<NoteView[]> {
    const { cycle, candidate } = await this.resolve(caps, applicationId);
    const rows = await this.repository.listNotes(cycle.id, candidate.profile_id);
    return rows.map((row) => ({
      id: row.id,
      authorName: row.author_name ?? "Former member",
      authorRoleLabel: row.author_role_label,
      kind: row.kind,
      body: row.body,
      createdAt: row.created_at,
      editedAt: row.edited_at,
      canEdit: row.author_id === actorId,
      canDelete: row.author_id === actorId || caps.viewer.role === "pres",
    }));
  }

  async addNote(
    caps: Capabilities,
    actorId: string,
    applicationId: string,
    input: NoteInput
  ): Promise<void> {
    const { cycle, candidate } = await this.resolve(caps, applicationId);
    await this.repository.addNote(
      cycle.id,
      candidate.profile_id,
      actorId,
      roleLabel(caps.viewer),
      input.kind,
      input.body
    );
  }

  async updateNote(
    caps: Capabilities,
    actorId: string,
    noteId: string,
    input: NoteInput
  ): Promise<void> {
    const note = await this.findNote(caps, noteId);
    if (note.author_id !== actorId) throw new ApiError("You can only edit your own notes", 403);
    await this.repository.updateNote(noteId, input.kind, input.body);
  }

  async deleteNote(caps: Capabilities, actorId: string, noteId: string): Promise<void> {
    const note = await this.findNote(caps, noteId);
    if (note.author_id !== actorId && caps.viewer.role !== "pres") {
      throw new ApiError("Only presidents can delete other people's notes", 403);
    }
    await this.repository.deleteNote(noteId);
  }

  /** Moves, notes and the application itself, newest first. */
  async getActivity(caps: Capabilities, applicationId: string): Promise<ActivityItem[]> {
    const { cycle, candidate } = await this.resolve(caps, applicationId);
    const [moves, notes, positions] = await Promise.all([
      this.repository.getMoveEvents(cycle.id, applicationId),
      this.repository.listNotes(cycle.id, candidate.profile_id),
      this.candidates.getPositions(cycle.id, applicationId),
    ]);

    const items: ActivityItem[] = [
      ...moves.map((row): ActivityItem => ({
        type: "move",
        id: row.id,
        actorName: row.actor_name,
        positionName: row.position_name,
        from: row.from_status,
        to: row.to_status,
        undo: row.reason === "undo",
        reason: row.reason === "undo" ? null : row.reason,
        at: row.created_at,
      })),
      ...notes.map((row): ActivityItem => ({
        type: "note",
        id: row.id,
        actorName: row.author_name,
        kind: row.kind,
        at: row.created_at,
      })),
      {
        type: "applied",
        id: candidate.id,
        positionNames: positions.map((row) => row.position_name),
        at: candidate.submitted_at,
      },
    ];
    return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }

  private async resolve(
    caps: Capabilities,
    applicationId: string
  ): Promise<{ cycle: RecruitingCycleSummary; candidate: CandidateRow }> {
    const cycle = this.requireCycle(caps);
    const candidate = await this.candidates.getCandidate(cycle.id, cycle.termId, applicationId);
    if (!candidate) throw new ApiError("Candidate not found in this cycle", 404);
    return { cycle, candidate };
  }

  private async findNote(caps: Capabilities, noteId: string) {
    const cycle = this.requireCycle(caps);
    const note = await this.repository.getNote(cycle.id, noteId);
    if (!note) throw new ApiError("Note not found", 404);
    return note;
  }

  private requireCycle(caps: Capabilities): RecruitingCycleSummary {
    if (!caps.cycle) throw new ApiError("There's no hiring cycle yet", 404);
    return caps.cycle;
  }
}

export const notesService = new NotesService();
