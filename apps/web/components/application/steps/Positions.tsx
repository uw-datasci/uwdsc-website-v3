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
import { Briefcase, Users } from "lucide-react";
import {
  renderSelectField,
  renderTextAreaField,
} from "@/components/FormHelpers";
import { AVAILABLE_POSITIONS } from "@/constants/positions";
import { useEffect } from "react";
import { DuplicateBanner } from "../banners/DuplicateBanner";
import { VPConsideration } from "../banners/VPConsideration";

interface PositionsProps {
  readonly form: UseFormReturn<AppFormValues>;
}

export function Positions({ form }: PositionsProps) {
  const position1 = form.watch("position_1");
  const position2 = form.watch("position_2");
  const position3 = form.watch("position_3");

  // Find the selected position data
  const getPositionData = (positionId: string) => {
    return AVAILABLE_POSITIONS.find((p) => p.id === positionId);
  };

  const position1Data = position1 ? getPositionData(position1) : undefined;
  const position2Data = position2 ? getPositionData(position2) : undefined;
  const position3Data = position3 ? getPositionData(position3) : undefined;

  // Get available positions excluding already selected ones
  const getAvailablePositions = (
    currentPosition?: string,
    includeNone: boolean = false,
  ) => {
    const selected = new Set(
      [position1, position2, position3].filter(
        (p) => p && p !== currentPosition,
      ),
    );
    const available = AVAILABLE_POSITIONS.filter(
      (p) => !selected.has(p.id),
    ).map((p) => p.name);

    // Add "None" option for optional positions
    if (includeNone) {
      return ["None (Remove selection)", ...available];
    }

    return available;
  };

  // Map position name back to ID for form submission
  const getPositionId = (name: string) => {
    if (name === "None (Remove selection)") return "";
    return AVAILABLE_POSITIONS.find((p) => p.name === name)?.id || "";
  };

  // Clear answers when position is deselected
  useEffect(() => {
    if (!position1) {
      form.setValue("position_1_answers", {});
    }
  }, [position1, form]);

  useEffect(() => {
    if (!position2) {
      form.setValue("position_2_answers", {});
    }
  }, [position2, form]);

  useEffect(() => {
    if (!position3) {
      form.setValue("position_3_answers", {});
    }
  }, [position3, form]);

  return (
    <div className="space-y-6">
      <VPConsideration />
      <DuplicateBanner />

      <div className="mb-5 flex flex-col gap-3 px-4">
        <div className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-blue-300" />
          <h2 className="text-xl font-semibold text-white">
            Position Preferences
          </h2>
        </div>
        <p className="mb-2 block text-base text-white">
          Please select <b>at least 1 and up to 3</b> positions you are
          interested in, and answer the corresponding questions.
        </p>
      </div>

      <Form {...form}>
        {/* Position 1 - Required */}
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
              render={({ field }) => {
                const availablePositions = getAvailablePositions(position1);
                return renderSelectField({
                  placeholder: "Choose a position to apply for",
                  options: availablePositions,
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
                      const positionId = getPositionId(value);
                      field.onChange(positionId);
                    },
                    value:
                      AVAILABLE_POSITIONS.find((p) => p.id === field.value)
                        ?.name || "",
                  },
                });
              }}
            />

            {position1Data && (
              <>
                {position1Data.questions.map((q) => (
                  <FormField
                    key={q.id}
                    control={form.control}
                    name={`position_1_answers.${q.id}` as any}
                    render={renderTextAreaField({
                      placeholder: q.placeholder,
                      label: q.question,
                      required: true,
                    })}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Position 2 - Optional */}
        <Card className="border-white/20 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Briefcase className="mr-2 h-5 w-5 text-blue-300" />
              Position #2{" "}
              <span className="ml-2 text-sm font-normal text-gray-400">
                (Optional)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="position_2"
              render={({ field }) => {
                const availablePositions = getAvailablePositions(
                  position2,
                  true, // Include "None" option
                );
                return renderSelectField({
                  placeholder: "Choose a position to apply for",
                  options: availablePositions,
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
                      const positionId = getPositionId(value);
                      field.onChange(positionId);
                    },
                    value:
                      AVAILABLE_POSITIONS.find((p) => p.id === field.value)
                        ?.name || "",
                  },
                });
              }}
            />

            {position2Data && (
              <>
                {position2Data.questions.map((q) => (
                  <FormField
                    key={q.id}
                    control={form.control}
                    name={`position_2_answers.${q.id}` as any}
                    render={renderTextAreaField({
                      placeholder: q.placeholder,
                      label: q.question,
                      required: true,
                    })}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* Position 3 - Optional */}
        <Card className="border-white/20 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Briefcase className="mr-2 h-5 w-5 text-blue-300" />
              Position #3{" "}
              <span className="ml-2 text-sm font-normal text-gray-400">
                (Optional)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="position_3"
              render={({ field }) => {
                const availablePositions = getAvailablePositions(
                  position3,
                  true, // Include "None" option
                );
                return renderSelectField({
                  placeholder: "Choose a position to apply for",
                  options: availablePositions,
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
                      const positionId = getPositionId(value);
                      field.onChange(positionId);
                    },
                    value:
                      AVAILABLE_POSITIONS.find((p) => p.id === field.value)
                        ?.name || "",
                  },
                });
              }}
            />

            {position3Data && (
              <>
                {position3Data.questions.map((q) => (
                  <FormField
                    key={q.id}
                    control={form.control}
                    name={`position_3_answers.${q.id}` as any}
                    render={renderTextAreaField({
                      placeholder: q.placeholder,
                      label: q.question,
                      required: true,
                    })}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
