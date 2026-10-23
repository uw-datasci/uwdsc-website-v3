"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Archive, ArchiveRestore, ArrowDown, ArrowUp, Lock, Pencil, Plus } from "lucide-react";
import { DEFAULT_ANSWER_MAX_LENGTH, QUESTION_TYPE_LABELS } from "@uwdsc/common/constants";
import type { QuestionFields } from "@uwdsc/common/schemas";
import type { SetupQuestion, SetupView } from "@uwdsc/common/types";
import { Badge, Button, Card, Label, Switch, cn } from "@uwdsc/ui";
import { createQuestion, reorderQuestions, updateQuestion } from "@/lib/api";
import { QuestionDialog } from "./QuestionDialog";

interface Section {
  key: string;
  positionId: number | null;
  title: string;
  subtitle: string;
  editable: boolean;
  owner: string;
}

interface QuestionsCardProps {
  readonly view: SetupView;
  readonly onSaved: () => Promise<void>;
}

export function QuestionsCard({ view, onSaved }: QuestionsCardProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [dialog, setDialog] = useState<{
    section: Section;
    question: SetupQuestion | null;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const sections: Section[] = [
    {
      key: "general",
      positionId: null,
      title: "General",
      subtitle: "Everyone answers these",
      editable: view.canEditGeneralQuestions,
      owner: "Presidents",
    },
    ...view.positions.map((position) => ({
      key: String(position.positionId),
      positionId: position.positionId,
      title: position.name,
      subtitle: `${position.subteamName ?? "Exec"}${position.isOpen ? "" : " · closed"}`,
      editable: position.canEditQuestions,
      owner: position.owner,
    })),
  ];

  const run = async (action: () => Promise<void>, failure: string) => {
    setBusy(true);
    try {
      await action();
      await onSaved();
    } catch (err) {
      toast.error((err as Error).message || failure);
    } finally {
      setBusy(false);
    }
  };

  const move = (section: Section, list: SetupQuestion[], index: number, delta: number) => {
    const ids = list.map((q) => q.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target]!, ids[index]!];
    void run(
      () => reorderQuestions({ positionId: section.positionId, questionIds: ids }),
      "Couldn't reorder"
    );
  };

  const submitDialog = async (fields: QuestionFields) => {
    if (!dialog) return;
    const { section, question } = dialog;
    if (question) await updateQuestion(question.id, fields);
    else await createQuestion({ ...fields, positionId: section.positionId });
    toast.success(question ? "Question saved" : "Question added");
    await onSaved();
  };

  const archivedCount = view.questions.filter((q) => q.archivedAt).length;

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold">Questions</h3>
          <p className="text-sm text-muted-foreground">
            Questions carry over between cycles. Archive one to hide it from new applications;
            past answers keep it.
          </p>
        </div>
        {archivedCount > 0 && (
          <div className="flex items-center gap-2">
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived" className="text-sm font-normal">
              Show archived ({archivedCount})
            </Label>
          </div>
        )}
      </div>

      <div className="flex flex-col divide-y">
        {sections.map((section) => {
          const all = view.questions.filter((q) => q.positionId === section.positionId);
          const active = all.filter((q) => !q.archivedAt);
          const shown = showArchived ? all : active;

          return (
            <section
              key={section.key}
              className="px-5 py-4"
              aria-label={`${section.title} questions`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold">{section.title}</h4>
                <span className="text-xs text-muted-foreground">{section.subtitle}</span>
                {!section.editable && (
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="size-3" aria-hidden />
                    Owned by {section.owner}
                  </span>
                )}
                {section.editable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    disabled={busy}
                    onClick={() => setDialog({ section, question: null })}
                  >
                    <Plus aria-hidden />
                    Add question
                  </Button>
                )}
              </div>

              {shown.length === 0 ? (
                <p className="rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground">
                  {section.editable
                    ? "No questions yet. Add one so applicants know what to answer."
                    : "No questions yet."}
                </p>
              ) : (
                <ol className="flex flex-col gap-1.5">
                  {shown.map((question) => {
                    const index = active.findIndex((q) => q.id === question.id);
                    const archived = question.archivedAt !== null;
                    return (
                      <li
                        key={question.id}
                        className={cn(
                          "flex items-start gap-3 rounded-md border px-3 py-2.5",
                          archived && "bg-muted/40"
                        )}
                      >
                        <span className="mt-0.5 w-5 flex-none text-xs font-semibold text-muted-foreground tabular-nums">
                          {archived ? "–" : index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={cn("text-sm", archived && "text-muted-foreground")}>
                            {question.questionText}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {QUESTION_TYPE_LABELS[question.type]} · up to{" "}
                            {question.maxLength ?? DEFAULT_ANSWER_MAX_LENGTH} characters ·{" "}
                            {question.answers} {question.answers === 1 ? "answer" : "answers"}
                          </p>
                        </div>
                        {archived && <Badge variant="secondary">Archived</Badge>}
                        {section.editable && (
                          <div className="flex flex-none items-center">
                            {!archived && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  aria-label="Move up"
                                  disabled={busy || index <= 0}
                                  onClick={() => move(section, active, index, -1)}
                                >
                                  <ArrowUp className="size-4" aria-hidden />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  aria-label="Move down"
                                  disabled={busy || index >= active.length - 1}
                                  onClick={() => move(section, active, index, 1)}
                                >
                                  <ArrowDown className="size-4" aria-hidden />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  aria-label="Edit question"
                                  disabled={busy}
                                  onClick={() => setDialog({ section, question })}
                                >
                                  <Pencil className="size-4" aria-hidden />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              aria-label={archived ? "Restore question" : "Archive question"}
                              disabled={busy}
                              onClick={() =>
                                run(
                                  () => updateQuestion(question.id, { archived: !archived }),
                                  "Couldn't update the question"
                                )
                              }
                            >
                              {archived ? (
                                <ArchiveRestore className="size-4" aria-hidden />
                              ) : (
                                <Archive className="size-4" aria-hidden />
                              )}
                            </Button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          );
        })}
      </div>

      <QuestionDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        section={dialog?.section.title ?? ""}
        question={dialog?.question ?? null}
        onSubmit={submitDialog}
      />
    </Card>
  );
}
