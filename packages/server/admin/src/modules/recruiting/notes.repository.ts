import { BaseRepository } from "@uwdsc/db/base.repository";
import type { ApplicationReviewStatus, NoteKind } from "@uwdsc/common/types";

export interface NoteRow {
  id: string;
  author_id: string | null;
  author_name: string | null;
  author_role_label: string;
  kind: NoteKind;
  body: string;
  created_at: string;
  edited_at: string | null;
}

export interface NoteOwnerRow {
  id: string;
  author_id: string | null;
}

export interface MoveEventRow {
  id: string;
  actor_name: string | null;
  position_name: string;
  from_status: ApplicationReviewStatus | null;
  to_status: ApplicationReviewStatus;
  reason: string | null;
  created_at: string;
}

export class NotesRepository extends BaseRepository {
  async listNotes(cycleId: string, profileId: string): Promise<NoteRow[]> {
    return this.sql<NoteRow[]>`
      SELECT
        n.id,
        n.author_id,
        COALESCE(NULLIF(btrim(concat_ws(' ', p.first_name, p.last_name)), ''), au.email) AS author_name,
        n.author_role_label,
        n.kind,
        n.body,
        n.created_at,
        CASE WHEN n.updated_at > n.created_at + interval '1 second' THEN n.updated_at END
          AS edited_at
      FROM hiring.candidate_notes n
      LEFT JOIN public.profiles p ON p.id = n.author_id
      LEFT JOIN auth.users au ON au.id = n.author_id
      WHERE n.cycle_id = ${cycleId}
        AND n.candidate_profile_id = ${profileId}
        AND n.deleted_at IS NULL
      ORDER BY n.created_at DESC
    `;
  }

  async addNote(
    cycleId: string,
    profileId: string,
    authorId: string,
    authorRoleLabel: string,
    kind: NoteKind,
    body: string
  ): Promise<void> {
    await this.sql`
      INSERT INTO hiring.candidate_notes
        (cycle_id, candidate_profile_id, author_id, author_role_label, kind, body)
      VALUES (${cycleId}, ${profileId}, ${authorId}, ${authorRoleLabel}, ${kind}, ${body})
    `;
  }

  async getNote(cycleId: string, noteId: string): Promise<NoteOwnerRow | null> {
    const rows = await this.sql<NoteOwnerRow[]>`
      SELECT id, author_id
      FROM hiring.candidate_notes
      WHERE id = ${noteId} AND cycle_id = ${cycleId} AND deleted_at IS NULL
    `;
    return rows[0] ?? null;
  }

  async updateNote(noteId: string, kind: NoteKind, body: string): Promise<void> {
    await this.sql`
      UPDATE hiring.candidate_notes
      SET kind = ${kind}, body = ${body}
      WHERE id = ${noteId} AND deleted_at IS NULL
    `;
  }

  async deleteNote(noteId: string): Promise<void> {
    await this.sql`
      UPDATE hiring.candidate_notes
      SET deleted_at = now()
      WHERE id = ${noteId} AND deleted_at IS NULL
    `;
  }

  /** Status moves on the application's cards in this cycle. */
  async getMoveEvents(cycleId: string, applicationId: string): Promise<MoveEventRow[]> {
    return this.sql<MoveEventRow[]>`
      SELECT
        se.id,
        COALESCE(NULLIF(btrim(concat_ws(' ', p.first_name, p.last_name)), ''), au.email) AS actor_name,
        ep.name AS position_name,
        se.from_status,
        se.to_status,
        se.reason,
        se.created_at
      FROM hiring.selection_events se
      JOIN hiring.application_position_selections s ON s.id = se.selection_id
      JOIN hiring.application_positions_available apa ON apa.id = s.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN public.profiles p ON p.id = se.actor_id
      LEFT JOIN auth.users au ON au.id = se.actor_id
      WHERE s.application_id = ${applicationId} AND apa.cycle_id = ${cycleId}
      ORDER BY se.created_at DESC
    `;
  }
}
