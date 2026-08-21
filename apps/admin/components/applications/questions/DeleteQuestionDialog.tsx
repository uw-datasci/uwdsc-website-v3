"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uwdsc/ui";
import type { AppQuestion } from "@uwdsc/common/types";

interface DeleteQuestionDialogProps {
  readonly question: AppQuestion | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly deleting: boolean;
  readonly onConfirm: () => void | Promise<void>;
}

export function DeleteQuestionDialog({
  question,
  onOpenChange,
  deleting,
  onConfirm,
}: DeleteQuestionDialogProps) {
  return (
    <Dialog open={question !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete question</DialogTitle>
          <DialogDescription>
            This removes the question from the position&apos;s form.{" "}
            {question && (
              <span
                className="mt-2 block max-w-full break-words whitespace-normal font-medium text-foreground"
                title={question.question_text}
              >
                {question.question_text}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
            }}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
