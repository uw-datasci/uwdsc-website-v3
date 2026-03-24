"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uwdsc/ui";
import type { AppQuestion } from "@uwdsc/common/types";

interface QuestionsTableProps {
  readonly questions: AppQuestion[];
  readonly onEdit: (question: AppQuestion) => void;
  readonly onRequestDelete: (question: AppQuestion) => void;
}

export function QuestionsTable({
  questions,
  onEdit,
  onRequestDelete,
}: QuestionsTableProps) {
  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        No questions yet. Add one to get started.
      </p>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[140px] pl-4">Position</TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="w-[110px] pr-6">Type</TableHead>
            <TableHead className="w-[140px] pl-6 text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q.relation_id}>
              <TableCell className="align-top pl-4 text-sm font-medium">
                {q.position_name ?? (
                  <span className="text-muted-foreground">General</span>
                )}
              </TableCell>
              <TableCell className="align-top max-w-md">
                <span
                  className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm"
                  title={q.question_text}
                >
                  {q.question_text}
                </span>
              </TableCell>
              <TableCell className="align-top pr-6 text-sm">{q.type}</TableCell>
              <TableCell className="align-top pl-6 text-center">
                <div className="flex justify-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Edit question"
                    onClick={() => onEdit(q)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Delete question"
                    onClick={() => onRequestDelete(q)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
