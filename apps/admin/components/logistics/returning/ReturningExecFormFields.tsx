import { useEffect } from "react";
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
  cn,
  renderSelectField,
  renderStringRadioGroupField,
  renderTextAreaField,
  renderTextField,
} from "@uwdsc/ui";

import type { ReturningExecFormValues } from "@/lib/schemas/returningExec";

/** Radix Select forbids `SelectItem value=""`; map this sentinel to cleared optional choices in form state. */
export const NO_POSITION_SELECT_VALUE = "__none__";

const IN_PERSON_RADIO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no_outside_gta", label: "No, outside of GTA" },
  {
    value: "no_in_gta",
    label: "No, but in the GTA (able to commute to Waterloo)",
  },
  { value: "not_sure", label: "Not sure" },
] as const;

const FOLLOW_UP_FIELDS = [
  "first_choice_position",
  "second_choice_position",
  "third_choice_position",
  "in_person_next_term",
  "qualifications",
] as const;

const RADIO_GROUP_CLASS = "flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:gap-6";

type SelectOption = { value: string; label: string };

type ReturningExecFormFieldsProps = Readonly<{
  form: UseFormReturn<ReturningExecFormValues>;
  followUpDisabled: boolean;
  deferredReturnTermCode: string;
  positionOptions: SelectOption[];
  submitted: boolean;
  submitting: boolean;
  submitButtonLoadingText: string;
  submitButtonIdleText: string;
}>;

function clearFollowUpFields(form: UseFormReturn<ReturningExecFormValues>) {
  form.setValue("first_choice_position", "");
  form.setValue("second_choice_position", "");
  form.setValue("third_choice_position", "");
  form.setValue("in_person_next_term", undefined);
  form.setValue("qualifications", "");
  form.clearErrors([...FOLLOW_UP_FIELDS]);
  void form.trigger();
}

function buildOptionalRoleSelect(
  followUpDisabled: boolean,
  locked: boolean,
  lockPlaceholder: string,
  options: SelectOption[],
  excludeIds: readonly string[],
) {
  const disabled = followUpDisabled || locked;
  const excluded = new Set(excludeIds.filter(Boolean));
  return {
    disabled,
    dimmed: locked && !followUpDisabled,
    placeholder: followUpDisabled ? "N/A" : locked ? lockPlaceholder : "Select a position",
    options: options.filter((opt) => !excluded.has(opt.value)),
  };
}

function OptionalRoleSelect({
  form,
  name,
  label,
  ui,
}: Readonly<{
  form: UseFormReturn<ReturningExecFormValues>;
  name: "second_choice_position" | "third_choice_position";
  label: string;
  ui: ReturnType<typeof buildOptionalRoleSelect>;
}>) {
  return (
    <div
      key={`${name}-${ui.disabled ? "off" : "on"}`}
      className={cn(ui.dimmed && "opacity-50")}
    >
      <FormField
        control={form.control}
        name={name}
        render={renderSelectField({
          label,
          placeholder: ui.placeholder,
          required: false,
          disabled: ui.disabled,
          clearValueSentinel: NO_POSITION_SELECT_VALUE,
          options: ui.options,
        })}
      />
    </div>
  );
}

export function ReturningExecFormFields({
  form,
  followUpDisabled,
  deferredReturnTermCode,
  positionOptions,
  submitted,
  submitting,
  submitButtonLoadingText,
  submitButtonIdleText,
}: ReturningExecFormFieldsProps) {
  const interestedInReturning = form.watch("interested_in_returning");
  const firstChoice = form.watch("first_choice_position") ?? "";
  const secondChoice = form.watch("second_choice_position") ?? "";
  const thirdChoice = form.watch("third_choice_position") ?? "";

  const optionalPositionOptions = [
    { value: NO_POSITION_SELECT_VALUE, label: "None" },
    ...positionOptions,
  ];

  const secondRole = buildOptionalRoleSelect(
    followUpDisabled,
    !firstChoice,
    "Select a first choice first",
    optionalPositionOptions,
    [firstChoice],
  );
  const thirdRole = buildOptionalRoleSelect(
    followUpDisabled,
    !firstChoice || !secondChoice,
    "Select a second choice first",
    optionalPositionOptions,
    [firstChoice, secondChoice],
  );

  const inPersonQuestionLabel =
    interestedInReturning === "future"
      ? `Will you be in person in ${deferredReturnTermCode}?`
      : "Will you be in person next term?";

  useEffect(() => {
    if (interestedInReturning === "false") clearFollowUpFields(form);
  }, [interestedInReturning, form]);

  useEffect(() => {
    if (followUpDisabled) return;

    const secondInvalid =
      Boolean(secondChoice) && (!firstChoice || secondChoice === firstChoice);
    const thirdInvalid =
      Boolean(thirdChoice) &&
      (!firstChoice ||
        !secondChoice ||
        thirdChoice === firstChoice ||
        thirdChoice === secondChoice);

    if (secondInvalid) form.setValue("second_choice_position", "", { shouldValidate: true });
    if (thirdInvalid) form.setValue("third_choice_position", "", { shouldValidate: true });
  }, [firstChoice, secondChoice, thirdChoice, followUpDisabled, form]);

  const interestRadioOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
    {
      value: "future",
      label: `No, but interested in returning to ${deferredReturnTermCode}`,
    },
  ] as const;

  const followUpKey = followUpDisabled ? "disabled" : "enabled";
  const { isValid } = form.formState;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col self-stretch">
          <Card className="flex min-h-0 flex-1 flex-col gap-0">
            <div className="flex shrink-0 flex-col gap-6">
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

            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <CardHeader className="shrink-0">
                <CardTitle>Return Interest</CardTitle>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
                <div className="shrink-0">
                  <FormField
                    control={form.control}
                    name="interested_in_returning"
                    render={renderStringRadioGroupField({
                      label: "Are you interested in returning and building on your impact?",
                      required: true,
                      idPrefix: "returning-exec-interest",
                      groupClassName: RADIO_GROUP_CLASS,
                      options: interestRadioOptions,
                    })}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="not_returning_reason"
                  render={renderTextAreaField({
                    label: "Please provide a brief explanation (Optional)",
                    placeholder: "Share any context you'd like us to know",
                    required: false,
                    stretchToParent: true,
                    className: "resize-none",
                    textareaProps: { rows: 1 },
                  })}
                />
              </CardContent>
            </div>
          </Card>
        </div>

        <div className="flex h-full min-h-0 w-full min-w-0 flex-col self-stretch">
          <Card className="flex min-h-0 flex-1 flex-col gap-0">
            <div className="flex shrink-0 flex-col gap-6">
              <CardHeader>
                <CardTitle>Role Preferences</CardTitle>
              </CardHeader>
              <CardContent
                key={`roles-${followUpKey}`}
                className={cn("space-y-4", followUpDisabled && "opacity-50")}
              >
                <FormField
                  control={form.control}
                  name="first_choice_position"
                  render={renderSelectField({
                    label: "First choice role",
                    placeholder: followUpDisabled ? "N/A" : "Select a position",
                    required: !followUpDisabled,
                    disabled: followUpDisabled,
                    options: positionOptions,
                  })}
                />
                <OptionalRoleSelect
                  form={form}
                  name="second_choice_position"
                  label="Second choice role (Optional)"
                  ui={secondRole}
                />
                <OptionalRoleSelect
                  form={form}
                  name="third_choice_position"
                  label="Third choice role (Optional)"
                  ui={thirdRole}
                />
              </CardContent>
            </div>

            <Separator className="my-6 shrink-0" />

            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <CardHeader className="shrink-0">
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent
                key={`details-${followUpKey}`}
                className={cn(
                  "flex min-h-0 flex-1 flex-col gap-4",
                  followUpDisabled && "opacity-50",
                )}
              >
                <div className="shrink-0">
                  <FormField
                    key={inPersonQuestionLabel}
                    control={form.control}
                    name="in_person_next_term"
                    render={renderStringRadioGroupField({
                      label: inPersonQuestionLabel,
                      required: !followUpDisabled,
                      disabled: followUpDisabled,
                      idPrefix: "returning-exec-in-person",
                      groupClassName: RADIO_GROUP_CLASS,
                      options: IN_PERSON_RADIO_OPTIONS,
                    })}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="qualifications"
                  render={renderTextAreaField({
                    label: "Why are you interested/qualified for the role?",
                    placeholder: followUpDisabled ? "N/A" : "Enter your answer here...",
                    required: !followUpDisabled,
                    stretchToParent: true,
                    className: "resize-none text-sm",
                    textareaProps: { rows: 2, disabled: followUpDisabled },
                  })}
                />
              </CardContent>
            </div>
          </Card>
        </div>
      </div>

      <Card className="gap-0">
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
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
        <Button type="submit" disabled={submitting || !isValid}>
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
