"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Toggle,
} from "@uwdsc/ui";
import type { AppQuestion, QuestionPositionOption } from "@uwdsc/common/types";
import { QuestionsTable } from "./QuestionsTable";

interface QuestionsBankSectionProps {
  readonly positions: QuestionPositionOption[];
  readonly questions: AppQuestion[];
  readonly isPresident: boolean;
  readonly onAddClick: () => void;
  readonly onEdit: (question: AppQuestion) => void;
  readonly onView: (question: AppQuestion) => void;
  readonly onRequestDelete: (question: AppQuestion) => void;
}

export function QuestionsBankSection({
  positions,
  questions,
  isPresident,
  onAddClick,
  onEdit,
  onView,
  onRequestDelete,
}: QuestionsBankSectionProps) {
  const [presidentFiltersSelected, setPresidentFiltersSelected] = useState<
    Set<string>
  >(new Set(["all"]));

  const ownQuestions = questions.filter((q) => q.can_edit);
  const otherQuestions = questions.filter((q) => !q.can_edit);

  const presidentFilters = useMemo(() => {
    const filters = [
      { key: "all", label: "All" },
      { key: "general", label: "General" },
      ...positions.map((p) => ({
        key: `position:${p.id}`,
        label: p.name,
      })),
    ];
    return filters;
  }, [positions]);

  const presidentFilteredQuestions = useMemo(() => {
    if (
      presidentFiltersSelected.size === 0 ||
      presidentFiltersSelected.has("all")
    ) {
      return questions;
    }

    const includeGeneral = presidentFiltersSelected.has("general");
    const selectedPositionIds = new Set(
      Array.from(presidentFiltersSelected)
        .filter((key) => key.startsWith("position:"))
        .map((key) => Number(key.replace("position:", "")))
        .filter((id) => !Number.isNaN(id)),
    );

    return questions.filter((q) => {
      if (q.position_id === null) return includeGeneral;
      return selectedPositionIds.has(q.position_id);
    });
  }, [presidentFiltersSelected, questions]);

  const onPresidentFilterToggle = (filterKey: string, pressed: boolean) => {
    setPresidentFiltersSelected((prev) => {
      if (filterKey === "all") {
        return pressed ? new Set(["all"]) : new Set();
      }

      const next = new Set(prev);
      next.delete("all");

      if (pressed) {
        next.add(filterKey);
      } else {
        next.delete(filterKey);
      }

      if (next.size === 0) {
        next.add("all");
      }

      return next;
    });
  };

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
            <div className="flex flex-wrap gap-2 pt-1">
              {presidentFilters.map((filter) => {
                const isSelected = presidentFiltersSelected.has(filter.key);
                return (
                  <Toggle
                    key={filter.key}
                    pressed={isSelected}
                    onPressedChange={(pressed) =>
                      onPresidentFilterToggle(filter.key, pressed)
                    }
                    variant="outline"
                    size="sm"
                    className={
                      isSelected
                        ? "text-primary ring-inset ring-1 ring-muted-foreground/25"
                        : "text-muted-foreground"
                    }
                    aria-label={`Filter questions by ${filter.label}`}
                  >
                    {filter.label}
                  </Toggle>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <QuestionsTable
              questions={presidentFilteredQuestions}
              onEdit={onEdit}
              onView={onView}
              onRequestDelete={onRequestDelete}
              emptyMessage="No questions for this filter."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">
                  Your subteam questions
                </CardTitle>
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
                onView={onView}
                onRequestDelete={onRequestDelete}
                emptyMessage="No questions in your VP scope yet."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Other subteam questions
              </CardTitle>
              <CardDescription>
                Visible for context only. Questions outside your VP scope are
                read-only.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <QuestionsTable
                questions={otherQuestions}
                onEdit={onEdit}
                onView={onView}
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
