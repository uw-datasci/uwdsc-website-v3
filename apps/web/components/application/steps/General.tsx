"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  renderTextAreaField,
} from "@uwdsc/ui";
import { UseFormReturn } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import { MessageSquare } from "lucide-react";

import { GeneralTip } from "../banners/GeneralTip";

interface GeneralProps {
  readonly form: UseFormReturn<AppFormValues>;
}

const questions = [
  {
    name: "exec_positions" as const,
    question:
      "List all executive positions at clubs or community organizations that you've held within the last year (ie: UW Data Science Club, Events Coordinator, September - December 2024)",
    placeholder:
      "It's completely okay if you haven't held any positions before! We just love learning more about everyone's experiences.",
  },
  {
    name: "new_idea" as const,
    question:
      "At UW DSC, we place a high emphasis on innovation. We don't want to just repeat what was previously done, we want execs to brainstorm new ideas to positively impact the technology community at UWaterloo. Tell us about a new idea you have for the club that would be a significant improvement from what we currently do. This could be related to the subteam you're applying to, or relate to another one.",
    placeholder:
      "Share your innovative ideas for improving or expanding the club's impact...",
  },
  {
    name: "hobbies" as const,
    question: "Tell us about your hobbies :)",
    placeholder: "We'd love to hear more about who you are!",
  },
];

export function General({ form }: GeneralProps) {
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
                key={q.name}
                control={form.control}
                name={q.name}
                render={renderTextAreaField({
                  placeholder: q.placeholder,
                  label: q.question,
                  required: true,
                })}
              />
            ))}
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
