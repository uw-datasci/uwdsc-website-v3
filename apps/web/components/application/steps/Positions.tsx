"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  renderSelectField,
} from "@uwdsc/ui";
import { UseFormReturn, useWatch } from "react-hook-form";
import { AppFormValues } from "@/lib/schemas/application";
import { Briefcase, Users } from "lucide-react";
import { DuplicateBanner } from "../banners/DuplicateBanner";
import { VPConsideration } from "../banners/VPConsideration";
import { renderAnswerField } from "./answerField";
import type { PositionWithQuestions } from "@uwdsc/common/types";

interface PositionsProps {
  readonly form: UseFormReturn<AppFormValues>;
  readonly positions: PositionWithQuestions[];
}

export function Positions({ form, positions }: PositionsProps) {
  // useWatch, not form.watch: React Compiler (reactCompiler is on for this app)
  // caches the component body on `form`/`positions`, which never change identity,
  // so a `form.watch(...)` result taken here would freeze at its first value and
  // the role's questions would never render.
  const position1 = useWatch({ control: form.control, name: "position_1" });
  const position2 = useWatch({ control: form.control, name: "position_2" });
  const position3 = useWatch({ control: form.control, name: "position_3" });

  if (positions.length === 0) {
    return (
      <p className="text-muted-foreground">
        No positions available for this application period.
      </p>
    );
  }

  const getPositionData = (positionId: string) => {
    return positions.find((p) => p.id === positionId);
  };

  const position1Data = position1 ? getPositionData(position1) : undefined;
  const position2Data = position2 ? getPositionData(position2) : undefined;
  const position3Data = position3 ? getPositionData(position3) : undefined;

  const getAvailablePositions = (currentPosition?: string, includeNone: boolean = false) => {
    const selected = new Set(
      [position1, position2, position3].filter((p) => p && p !== currentPosition)
    );
    const available = positions.filter((p) => !selected.has(p.id)).map((p) => p.name);

    if (includeNone) {
      return ["None (Remove selection)", ...available];
    }
    return available;
  };

  const getPositionId = (name: string) => {
    if (name === "None (Remove selection)") return "";
    return positions.find((p) => p.name === name)?.id || "";
  };

  /**
   * Discard the answers typed for the previously selected role. Answers are
   * keyed by question id, so leaving them behind would mix two roles' answers
   * in the same record.
   */
  const clearAnswersOnChange = (
    answersField: "position_1_answers" | "position_2_answers" | "position_3_answers",
    nextId: string,
    currentId: string | undefined
  ) => {
    if (nextId === currentId) return;
    form.setValue(answersField, {});
    form.clearErrors(answersField);
  };

  return (
    <div className="space-y-6">
      <VPConsideration />
      <DuplicateBanner />

      <div className="mb-5 flex flex-col gap-3 px-4">
        <div className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-blue-300" />
          <h2 className="text-xl font-semibold text-white">Position Preferences</h2>
        </div>
        <p className="mb-2 block text-base text-white">
          Please select <b>at least 1 and up to 3</b> positions you are interested in, and
          answer the corresponding questions.
        </p>
      </div>

      <Form {...form}>
        <Card className="border-white/20 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Briefcase className="mr-2 h-5 w-5 text-blue-300" />
              Position #1
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="position_1"
              render={({ field }) =>
                renderSelectField({
                  placeholder: "Choose a position to apply for",
                  options: getAvailablePositions(position1),
                  label: "Select Position",
                  required: true,
                  triggerClassName: "w-full",
                  contentClassName: "bg-slate-700",
                  itemClassName:
                    "text-slate-200 focus:bg-slate-600 focus:text-white hover:bg-slate-600 hover:text-white transition-colors",
                })({
                  field: {
                    ...field,
                    onChange: (value: string) => {
                      const nextId = getPositionId(value);
                      clearAnswersOnChange("position_1_answers", nextId, field.value);
                      field.onChange(nextId);
                    },
                    value: positions.find((p) => p.id === field.value)?.name || "",
                  },
                })
              }
            />

            {position1Data?.questions.map((q) => (
              <FormField
                key={q.id}
                control={form.control}
                name={`position_1_answers.${q.id}`}
                render={renderAnswerField(q)}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Briefcase className="mr-2 h-5 w-5 text-blue-300" />
              Position #2{" "}
              <span className="ml-2 text-sm font-normal text-gray-400">(Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="position_2"
              render={({ field }) =>
                renderSelectField({
                  placeholder: "Choose a position to apply for",
                  options: getAvailablePositions(position2, true),
                  label: "Select Position",
                  required: false,
                  triggerClassName: "w-full",
                  contentClassName: "bg-slate-700",
                  itemClassName:
                    "text-slate-200 focus:bg-slate-600 focus:text-white hover:bg-slate-600 hover:text-white transition-colors",
                })({
                  field: {
                    ...field,
                    onChange: (value: string) => {
                      const nextId = getPositionId(value);
                      clearAnswersOnChange("position_2_answers", nextId, field.value);
                      field.onChange(nextId);
                    },
                    value: positions.find((p) => p.id === field.value)?.name || "",
                  },
                })
              }
            />

            {position2Data?.questions.map((q) => (
              <FormField
                key={q.id}
                control={form.control}
                name={`position_2_answers.${q.id}`}
                render={renderAnswerField(q)}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Briefcase className="mr-2 h-5 w-5 text-blue-300" />
              Position #3{" "}
              <span className="ml-2 text-sm font-normal text-gray-400">(Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="position_3"
              render={({ field }) =>
                renderSelectField({
                  placeholder: "Choose a position to apply for",
                  options: getAvailablePositions(position3, true),
                  label: "Select Position",
                  required: false,
                  triggerClassName: "w-full",
                  contentClassName: "bg-slate-700",
                  itemClassName:
                    "text-slate-200 focus:bg-slate-600 focus:text-white hover:bg-slate-600 hover:text-white transition-colors",
                })({
                  field: {
                    ...field,
                    onChange: (value: string) => {
                      const nextId = getPositionId(value);
                      clearAnswersOnChange("position_3_answers", nextId, field.value);
                      field.onChange(nextId);
                    },
                    value: positions.find((p) => p.id === field.value)?.name || "",
                  },
                })
              }
            />

            {position3Data?.questions.map((q) => (
              <FormField
                key={q.id}
                control={form.control}
                name={`position_3_answers.${q.id}`}
                render={renderAnswerField(q)}
              />
            ))}
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
