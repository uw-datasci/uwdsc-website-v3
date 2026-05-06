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
  positionOptions,
  optionalPositionSelectOptions,
  submitted,
  submitting,
  submitButtonLoadingText,
  submitButtonIdleText,
}: ReturningExecFormFieldsProps) {
  return (
    <>
      <Card>
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
              })}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={renderTextField({
                label: "Full name",
                placeholder: "Jane Smith",
                required: true,
              })}
            />
          </div>

          <FormField
            control={form.control}
            name="discord"
            render={renderTextField({
              label: "Discord handle",
              placeholder: "username#0000 or username",
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
              textareaProps: { rows: 3 },
            })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Return Interest</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="interested_in_returning"
            render={renderStringRadioGroupField({
              label: "Are you interested in returning and building on your impact?",
              required: true,
              idPrefix: "returning-exec-interest",
              groupClassName: "flex gap-6 pt-1",
              options: YES_NO_RADIO_OPTIONS,
            })}
          />

          {!isReturning && (
            <FormField
              control={form.control}
              name="not_returning_reason"
              render={renderTextAreaField({
                label: "Please provide a brief explanation (Optional)",
                placeholder: "Share any context you'd like us to know",
                required: false,
                className: "resize-none",
                textareaProps: { rows: 3 },
              })}
            />
          )}
        </CardContent>
      </Card>

      {isReturning && (
        <>
          <Card>
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <FormField
                control={form.control}
                name="qualifications"
                render={renderTextAreaField({
                  label: "Why are you interested/qualified for the role?",
                  placeholder: "Enter your answer here...",
                  required: true,
                  className: "resize-none text-sm",
                  textareaProps: { rows: 6 },
                })}
              />

              <FormField
                control={form.control}
                name="additional_notes"
                render={renderTextAreaField({
                  label: "Anything you would like us to know? (Optional)",
                  placeholder: "Any additional context...",
                  required: false,
                  className: "resize-none",
                  textareaProps: { rows: 3 },
                })}
              />
            </CardContent>
          </Card>
        </>
      )}

      <Separator />

      <div className="flex justify-end gap-3">
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
