"use client";

import type { UseFormReturn } from "react-hook-form";
import type { ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  renderTextField,
  renderTextAreaField,
  renderSelectField,
} from "@uwdsc/ui";
import type { QuestionPositionOption } from "@uwdsc/common/types";
import type { QuestionFormValues } from "@/lib/schemas/questions";

interface EditQuestionDialogProps {
  readonly form: UseFormReturn<QuestionFormValues>;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly editing: boolean;
  readonly isPresident: boolean;
  readonly positions: QuestionPositionOption[];
  readonly saving: boolean;
  readonly onSubmit: (values: QuestionFormValues) => void;
}

export function EditQuestionDialog({
  form,
  open,
  onOpenChange,
  editing,
  isPresident,
  positions,
  saving,
  onSubmit,
}: EditQuestionDialogProps) {
  let submitLabel = "Create";
  if (editing) submitLabel = "Save changes";
  if (saving) submitLabel = "Saving…";
  const placeholderFieldRenderer = renderTextField({
    label: "Placeholder (optional)",
    placeholder: "Optional placeholder shown in the input",
  });
  const helpTextFieldRenderer = renderTextAreaField({
    label: "Help text (optional)",
    placeholder: "Short hint shown under the field",
    className: "min-h-[72px]",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit question" : "New question"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update copy, validation, and which role this prompt belongs to."
              : "Create a prompt for an open role applicants can select."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question_text"
              render={renderTextAreaField({
                label: "Question",
                placeholder: "What should applicants answer?",
                required: true,
                className: "min-h-[100px]",
              })}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={renderSelectField({
                  label: "Input type",
                  placeholder: "Choose type",
                  required: true,
                  triggerClassName: "w-full",
                  options: [
                    { value: "textarea", label: "Long text (textarea)" },
                    { value: "text", label: "Short text (single line)" },
                  ],
                })}
              />

              <FormField
                control={form.control}
                name="position_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select
                      value={
                        field.value === null || field.value === undefined
                          ? "none"
                          : String(field.value)
                      }
                      onValueChange={(v) => {
                        field.onChange(v === "none" ? null : Number(v));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isPresident && (
                          <SelectItem value="none">
                            General (all roles)
                          </SelectItem>
                        )}
                        {positions.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            field.onChange(0);
                            return;
                          }
                          const n = Number.parseInt(raw, 10);
                          field.onChange(Number.isNaN(n) ? 0 : n);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max length (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="No limit"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") {
                            field.onChange(null);
                            return;
                          }
                          const n = Number.parseInt(v, 10);
                          field.onChange(Number.isNaN(n) ? null : n);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) =>
                placeholderFieldRenderer({
                  field: {
                    ...field,
                    value: field.value ?? "",
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      const next = e.target.value;
                      field.onChange(next === "" ? null : next);
                    },
                  } as never,
                })
              }
            />

            <FormField
              control={form.control}
              name="help_text"
              render={({ field }) =>
                helpTextFieldRenderer({
                  field: {
                    ...field,
                    value: field.value ?? "",
                    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
                      const next = e.target.value;
                      field.onChange(next === "" ? null : next);
                    },
                  } as never,
                })
              }
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
