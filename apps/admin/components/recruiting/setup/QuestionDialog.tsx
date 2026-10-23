"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  DEFAULT_ANSWER_MAX_LENGTH,
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
} from "@uwdsc/common/constants";
import type { QuestionFields } from "@uwdsc/common/schemas";
import type { SetupQuestion } from "@uwdsc/common/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  Spinner,
  renderSelectField,
  renderTextAreaField,
  renderTextField,
} from "@uwdsc/ui";
import { questionFormSchema, type QuestionFormValues } from "@/lib/schemas/recruiting";

interface QuestionDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly section: string;
  readonly question: SetupQuestion | null;
  readonly onSubmit: (fields: QuestionFields) => Promise<void>;
}

function toForm(question: SetupQuestion | null): QuestionFormValues {
  return {
    questionText: question?.questionText ?? "",
    type: question?.type ?? "textarea",
    maxLength: question?.maxLength ? String(question.maxLength) : "",
    placeholder: question?.placeholder ?? "",
    helpText: question?.helpText ?? "",
  };
}

export function QuestionDialog({
  open,
  onOpenChange,
  section,
  question,
  onSubmit,
}: QuestionDialogProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    values: toForm(question),
  });
  const isSubmitting = form.formState.isSubmitting;

  const submit = async (values: QuestionFormValues) => {
    try {
      await onSubmit({
        questionText: values.questionText,
        type: values.type,
        maxLength: values.maxLength === "" ? null : Number(values.maxLength),
        placeholder: values.placeholder || null,
        helpText: values.helpText || null,
      });
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || "Couldn't save the question");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{question ? "Edit question" : "Add question"}</DialogTitle>
          <DialogDescription>
            {section}.{" "}
            {question && question.answers > 0
              ? "Past answers keep the wording they were written against."
              : "Applicants see this on the application form."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) =>
                renderTextAreaField({
                  label: "Question",
                  placeholder: "Why do you want to join this team?",
                  required: true,
                })({ field })
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) =>
                  renderSelectField({
                    label: "Answer type",
                    placeholder: "Pick a type",
                    options: QUESTION_TYPES.map((value) => ({
                      value,
                      label: QUESTION_TYPE_LABELS[value],
                    })),
                    triggerClassName: "w-full",
                  })({ field })
                }
              />
              <FormField
                control={form.control}
                name="maxLength"
                render={({ field }) =>
                  renderTextField({
                    label: "Character limit",
                    placeholder: String(DEFAULT_ANSWER_MAX_LENGTH),
                    inputProps: { inputMode: "numeric" },
                  })({ field })
                }
              />
            </div>
            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) =>
                renderTextField({ label: "Placeholder", placeholder: "Optional" })({ field })
              }
            />
            <FormField
              control={form.control}
              name="helpText"
              render={({ field }) =>
                renderTextField({ label: "Help text", placeholder: "Optional" })({ field })
              }
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="size-4" />}
                {question ? "Save question" : "Add question"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
