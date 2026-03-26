"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  renderTextField,
  renderTextAreaField,
} from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import { MessageSquare } from "lucide-react";
import type { ApplicationInputType } from "@uwdsc/common/types";

import { GeneralTip } from "../banners/GeneralTip";

interface GeneralQuestion {
  id: string;
  question_text: string;
  type: ApplicationInputType;
  sort_order: number;
  placeholder: string | null;
  max_length: number | null;
}

interface GeneralProps {
  readonly form: UseFormReturn<AppFormValues>;
  readonly questions: GeneralQuestion[];
}

export function General({ form, questions }: GeneralProps) {
  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <GeneralTip />
        <p className="text-muted-foreground">
          No general questions for this application period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GeneralTip />

      <Form {...form}>
        <Card className="border-white/20 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <MessageSquare className="mr-2 h-5 w-5 text-blue-300" />
              General Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((q) => (
              <FormField
                key={q.id}
                control={form.control}
                name={`general_answers.${q.id}`}
                render={
                  q.type === "text"
                    ? renderTextField({
                        placeholder: q.placeholder ?? "",
                        label: q.question_text,
                        required: true,
                        inputProps:
                          q.max_length != null
                            ? { maxLength: q.max_length }
                            : undefined,
                      })
                    : renderTextAreaField({
                        placeholder: q.placeholder ?? "",
                        label: q.question_text,
                        required: true,
                        textareaProps:
                          q.max_length != null
                            ? { maxLength: q.max_length }
                            : undefined,
                        description:
                          q.max_length != null
                            ? (value) =>
                                `${value.length}/${q.max_length} characters`
                            : undefined,
                      })
                }
              />
            ))}
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
