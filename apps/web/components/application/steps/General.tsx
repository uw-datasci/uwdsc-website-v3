"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
} from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import { MessageSquare } from "lucide-react";
import type { GeneralQuestion } from "@uwdsc/common/types";

import { GeneralTip } from "../banners/GeneralTip";
import { renderAnswerField } from "./answerField";

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
                render={renderAnswerField(q)}
              />
            ))}
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
