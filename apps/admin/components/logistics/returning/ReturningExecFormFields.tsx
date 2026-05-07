import { Loader2, RotateCcw } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormField,
  Separator,
  renderSelectField,
  renderStringRadioGroupField,
  renderTextAreaField,
  renderTextField,
} from "@uwdsc/ui";

import type { ReturningExecFormValues } from "@/lib/schemas/returningExec";

/** Radix Select forbids `SelectItem value=""`; map this sentinel to cleared optional choices in form state. */
export const NO_POSITION_SELECT_VALUE = "__none__";

const YES_NO_RADIO_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
] as const;

type SelectOption = { value: string; label: string };

type ReturningExecFormFieldsProps = Readonly<{
  form: UseFormReturn<ReturningExecFormValues>;
  isReturning: boolean;
  isNotReturning: boolean;
  positionOptions: SelectOption[];
  optionalPositionSelectOptions: SelectOption[];
  submitted: boolean;
  submitting: boolean;
  submitButtonLoadingText: string;
  submitButtonIdleText: string;
}>;

export function ReturningExecFormFields({
  form,
  isReturning,
  isNotReturning,
  positionOptions,
  optionalPositionSelectOptions,
  submitted,
  submitting,
  submitButtonLoadingText,
  submitButtonIdleText,
}: ReturningExecFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
        <div
          className={
            isReturning
              ? "flex h-full min-h-0 w-full min-w-0 flex-col self-stretch"
              : "lg:col-span-2"
          }
        >
          <Card
            className={
              isReturning ? "flex min-h-0 flex-1 flex-col gap-0" : "gap-0"
            }
          >
            <div
              className={isReturning ? "flex shrink-0 flex-col gap-6" : "flex flex-col gap-6"}
            >
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={renderTextField({
                      label: "Email address",
                      placeholder: "you@example.com",
                      required: true,
                      inputProps: { disabled: true },
                    })}
                  />
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={renderTextField({
                      label: "Full name",
                      placeholder: "Jane Smith",
                      required: true,
                      inputProps: { disabled: true },
                    })}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="discord"
                  render={renderTextField({
                    label: "Discord handle",
                    placeholder: "username",
                    required: true,
                  })}
                />

                <FormField
                  control={form.control}
                  name="past_positions"
                  render={renderTextAreaField({
                    label: "List all positions & terms you've been on at UWDSC",
                    placeholder: "e.g. VP Marketing (W25), Events Lead (F24)",
                    required: true,
                    className: "resize-none",
                    textareaProps: { rows: 1 },
                  })}
                />
              </CardContent>
            </div>

            <Separator className="my-6 shrink-0" />

            <div
              className={
                isReturning
                  ? "flex min-h-0 flex-1 flex-col gap-6"
                  : "flex flex-col gap-6"
              }
            >
              <CardHeader className="shrink-0">
                <CardTitle>Return Interest</CardTitle>
              </CardHeader>
              <CardContent
                className={
                  isReturning
                    ? "flex min-h-0 flex-1 flex-col gap-4"
                    : "space-y-4"
                }
              >
                <div className={isReturning ? "shrink-0" : undefined}>
                  <FormField
                    control={form.control}
                    name="interested_in_returning"
                    render={renderStringRadioGroupField({
                      label:
                        "Are you interested in returning and building on your impact?",
                      required: true,
                      idPrefix: "returning-exec-interest",
                      groupClassName: "flex gap-6 pt-1",
                      options: YES_NO_RADIO_OPTIONS,
                    })}
                  />
                </div>

                {isNotReturning && (
                  <FormField
                    control={form.control}
                    name="not_returning_reason"
                    render={renderTextAreaField({
                      label: "Please provide a brief explanation (Optional)",
                      placeholder: "Share any context you'd like us to know",
                      required: false,
                      stretchToParent: isReturning,
                      className: "resize-none",
                      textareaProps: { rows: 1 },
                    })}
                  />
                )}

                {!isNotReturning && (
                  <FormField
                    control={form.control}
                    name="additional_notes"
                    render={renderTextAreaField({
                      label: "Anything you would like us to know? (Optional)",
                      placeholder: "Any additional context...",
                      required: false,
                      stretchToParent: isReturning,
                      className: "resize-none",
                      textareaProps: { rows: 1 },
                    })}
                  />
                )}
              </CardContent>
            </div>
          </Card>
        </div>

        {isReturning && (
          <div className="flex h-full min-h-0 w-full min-w-0 flex-col self-stretch">
            <Card className="flex min-h-0 flex-1 flex-col gap-0">
              <div className="flex shrink-0 flex-col gap-6">
                <CardHeader>
                  <CardTitle>Role Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_choice_position"
                    render={renderSelectField({
                      label: "First choice role",
                      placeholder: "Select a position",
                      required: true,
                      options: positionOptions,
                    })}
                  />

                  <FormField
                    control={form.control}
                    name="second_choice_position"
                    render={renderSelectField({
                      label: "Second choice role (Optional)",
                      placeholder: "Select a position",
                      required: false,
                      clearValueSentinel: NO_POSITION_SELECT_VALUE,
                      options: optionalPositionSelectOptions,
                    })}
                  />

                  <FormField
                    control={form.control}
                    name="third_choice_position"
                    render={renderSelectField({
                      label: "Third choice role (Optional)",
                      placeholder: "Select a position",
                      required: false,
                      clearValueSentinel: NO_POSITION_SELECT_VALUE,
                      options: optionalPositionSelectOptions,
                    })}
                  />
                </CardContent>
              </div>

              <Separator className="my-6 shrink-0" />

              <div className="flex min-h-0 flex-1 flex-col gap-6">
                <CardHeader className="shrink-0">
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
                  <div className="shrink-0">
                    <FormField
                      control={form.control}
                      name="in_person_next_term"
                      render={renderStringRadioGroupField({
                        label: "Will you be in person next term?",
                        required: true,
                        idPrefix: "returning-exec-in-person",
                        groupClassName: "flex gap-6 pt-1",
                        options: YES_NO_RADIO_OPTIONS,
                      })}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="qualifications"
                    render={renderTextAreaField({
                      label: "Why are you interested/qualified for the role?",
                      placeholder: "Enter your answer here...",
                      required: true,
                      stretchToParent: true,
                      className: "resize-none text-sm",
                      textareaProps: { rows: 2 },
                    })}
                  />
                </CardContent>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-end gap-2">
        {submitted && (
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={submitting}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {submitButtonLoadingText}
            </>
          ) : (
            submitButtonIdleText
          )}
        </Button>
      </div>
    </>
  );
}
