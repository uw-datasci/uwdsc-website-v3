"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { MAX_NOTE_LENGTH } from "@uwdsc/common/constants";
import type { NoteView } from "@uwdsc/common/types";
import { Button, Checkbox, Label, Spinner, Textarea } from "@uwdsc/ui";
import {
  addCandidateNote,
  deleteCandidateNote,
  getCandidateNotes,
  updateCandidateNote,
} from "@/lib/api";
import { formatActivityTime } from "@/lib/utils/recruiting";
import { PersonAvatar } from "../leadership/PersonAvatar";

interface NotesTabProps {
  readonly applicationId: string;
  /** Called after a note is added, edited or deleted (note counts, activity). */
  readonly onChanged: () => void;
}

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export function NotesTab({ applicationId, onChanged }: NotesTabProps) {
  const { data, error, isLoading, mutate } = useSWR<NoteView[], Error>(
    ["/api/recruiting/notes", applicationId],
    ([, id]: [string, string]) => getCandidateNotes(id),
    { shouldRetryOnError: false }
  );
  const [body, setBody] = useState("");
  const [interview, setInterview] = useState(false);
  const [posting, setPosting] = useState(false);

  const refresh = async () => {
    await mutate();
    onChanged();
  };

  const post = async () => {
    if (!body.trim()) return;
    setPosting(true);
    try {
      await addCandidateNote(applicationId, {
        body,
        kind: interview ? "interview" : "general",
      });
      setBody("");
      setInterview(false);
      await refresh();
    } catch (err) {
      toast.error(errorMessage(err, "Couldn't post the note"));
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 rounded-lg border p-3">
        <Label htmlFor="note-input" className="sr-only">
          Add a note
        </Label>
        <Textarea
          id="note-input"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add a note for other reviewers"
          rows={3}
          maxLength={MAX_NOTE_LENGTH}
          className="resize-y border-0 p-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="note-interview"
              checked={interview}
              onCheckedChange={(checked) => setInterview(checked === true)}
            />
            <Label htmlFor="note-interview" className="text-[13px] font-normal">
              Interview note
            </Label>
          </div>
          <span className="text-xs text-muted-foreground">
            Visible to presidents and all VPs
          </span>
          <Button
            size="sm"
            className="ml-auto"
            disabled={posting || !body.trim()}
            onClick={() => void post()}
          >
            {posting && <Spinner className="size-3.5" />}
            Post note
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner className="size-6" />
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">Couldn&apos;t load notes: {error.message}</p>
      )}
      {data?.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">No notes yet.</p>
      )}

      {data && data.length > 0 && (
        <ul className="flex flex-col gap-4">
          {data.map((note) => (
            <NoteItem key={note.id} note={note} onChanged={refresh} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NoteItem({
  note,
  onChanged,
}: {
  readonly note: NoteView;
  readonly onChanged: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.body);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>, fallback: string) => {
    setBusy(true);
    try {
      await action();
      await onChanged();
    } catch (err) {
      toast.error(errorMessage(err, fallback));
    } finally {
      setBusy(false);
    }
  };

  const save = () =>
    run(async () => {
      await updateCandidateNote(note.id, { body: draft, kind: note.kind });
      setEditing(false);
    }, "Couldn't save the note");

  const remove = () =>
    run(async () => {
      await deleteCandidateNote(note.id);
      toast.success("Note deleted");
    }, "Couldn't delete the note");

  return (
    <li className="flex gap-3">
      <PersonAvatar name={note.authorName} className="size-7 text-[10px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-[13px] font-semibold">{note.authorName}</span>
          <span className="rounded bg-muted px-1.5 py-px text-[11px] leading-4 text-muted-foreground">
            {note.authorRoleLabel}
          </span>
          {note.kind === "interview" && (
            <span className="rounded bg-blue-50 px-1.5 py-px text-[11px] leading-4 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              Interview note
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatActivityTime(note.createdAt)}
            {note.editedAt && " · edited"}
          </span>
          {!editing && (note.canEdit || note.canDelete) && (
            <span className="ml-auto flex items-center gap-0.5">
              {note.canEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  aria-label="Edit note"
                  disabled={busy}
                  onClick={() => {
                    setDraft(note.body);
                    setEditing(true);
                  }}
                >
                  <Pencil className="size-3.5" aria-hidden />
                </Button>
              )}
              {note.canDelete &&
                (confirmingDelete ? (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      disabled={busy}
                      onClick={() => void remove()}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      disabled={busy}
                      onClick={() => setConfirmingDelete(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    aria-label="Delete note"
                    disabled={busy}
                    onClick={() => setConfirmingDelete(true)}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </Button>
                ))}
            </span>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              maxLength={MAX_NOTE_LENGTH}
              aria-label="Edit note"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" disabled={busy || !draft.trim()} onClick={() => void save()}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-6 whitespace-pre-wrap">{note.body}</p>
        )}
      </div>
    </li>
  );
}
