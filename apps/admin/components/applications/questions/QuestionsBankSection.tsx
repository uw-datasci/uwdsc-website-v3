"use client";

import { Plus } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@uwdsc/ui";
import type { AppQuestion, QuestionPositionOption } from "@uwdsc/common/types";
import { QuestionsTable } from "./QuestionsTable";

interface QuestionsBankSectionProps {
  readonly positions: QuestionPositionOption[];
  readonly questions: AppQuestion[];
  readonly isPresident: boolean;
  readonly onAddClick: () => void;
  readonly onEdit: (question: AppQuestion) => void;
  readonly onRequestDelete: (question: AppQuestion) => void;
}

export function QuestionsBankSection({
  positions,
  questions,
  isPresident,
  onAddClick,
  onEdit,
  onRequestDelete,
}: QuestionsBankSectionProps) {
  const ownQuestions = questions.filter((q) => q.can_edit);
  const otherQuestions = questions.filter((q) => !q.can_edit);

  return (
    <>
      {positions.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No application positions are linked to your scope. You cannot add
          questions until positions are configured.
        </p>
      )}

      {isPresident ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">Question bank</CardTitle>
              <Button
                type="button"
                size="icon"
                onClick={onAddClick}
                disabled={positions.length === 0}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <CardDescription>
              Each row is a question tied to an open role. Same question text
              can exist per position; edits here affect future applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <QuestionsTable
              questions={questions}
              onEdit={onEdit}
              onRequestDelete={onRequestDelete}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">Your subteam questions</CardTitle>
                <Button
                  type="button"
                  size="icon"
                  onClick={onAddClick}
                  disabled={positions.length === 0}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <CardDescription>
                Questions assigned to your VP scope. You can create, edit, and
                delete these.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <QuestionsTable
                questions={ownQuestions}
                onEdit={onEdit}
                onRequestDelete={onRequestDelete}
                emptyMessage="No questions in your VP scope yet."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Other subteam questions</CardTitle>
              <CardDescription>
                Visible for context only. Questions outside your VP scope are
                read-only.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <QuestionsTable
                questions={otherQuestions}
                onEdit={onEdit}
                onRequestDelete={onRequestDelete}
                readOnly
                emptyMessage="No questions outside your VP scope."
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
