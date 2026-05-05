"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormField,
  Separator,
  renderSelectField,
  renderStringRadioGroupField,
  renderTextAreaField,
  renderTextField,
} from "@uwdsc/ui";
import { Loader2, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAvailablePositionsForReturningExec,
  getOwnReturningExecSubmission,
  upsertReturningExecSubmission,
  type AvailablePosition,
} from "@/lib/api/returningExecs";
import {
  ReturningExecDefaultValues,
  ReturningExecFormValues,
  returningExecSchema,
} from "@/lib/schemas/returningExec";

/** Radix Select forbids `SelectItem value=""`; map this sentinel to cleared optional choices in form state. */
const NO_POSITION_SELECT_VALUE = "__none__";

const YES_NO_RADIO_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
] as const;

function positionIdStringForPriority(
  selections: readonly { priority: number; position_id: number }[],
  priority: 1 | 2 | 3,
): string {
  const row = selections.find((s) => s.priority === priority);
  if (row) return String(row.position_id);

  return "";
}

export default function ReturningExecFormPage() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<AvailablePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ReturningExecFormValues>({
    resolver: zodResolver(returningExecSchema),
    defaultValues: ReturningExecDefaultValues,
  });

  const interestedInReturning = form.watch("interested_in_returning");
  const isReturning = interestedInReturning === "true";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [positionsData, submissionData] = await Promise.all([
          getAvailablePositionsForReturningExec(),
          getOwnReturningExecSubmission(),
        ]);
        setPositions(positionsData);

        const sub = submissionData.submission;
        if (sub) {
          setSubmitted(true);
          const sel = sub.position_selections ?? [];
          form.reset({
            email: sub.email,
            full_name: sub.full_name,
            discord: sub.discord,
            past_positions: sub.past_positions,
            interested_in_returning: sub.interested_in_returning ? "true" : "false",
            not_returning_reason: sub.not_returning_reason ?? "",
            first_choice_position: positionIdStringForPriority(sel, 1),
            second_choice_position: positionIdStringForPriority(sel, 2),
            third_choice_position: positionIdStringForPriority(sel, 3),
            in_person_next_term: sub.in_person_next_term ? "true" : "false",
            qualifications: sub.qualifications,
            additional_notes: sub.additional_notes ?? "",
          });
        } else if (user) {
          form.setValue(
            "full_name",
            [user.first_name, user.last_name].filter(Boolean).join(" "),
          );
          form.setValue("email", user.email ?? "");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load form data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, form]);

  async function onSubmit(values: ReturningExecFormValues) {
    setSubmitting(true);
    try {
      const isRet = values.interested_in_returning === "true";
      const positionSelections: { position_id: number; priority: 1 | 2 | 3 }[] = [];
      if (isRet) {
        if (values.first_choice_position)
          positionSelections.push({
            position_id: Number(values.first_choice_position),
            priority: 1,
          });
        if (values.second_choice_position)
          positionSelections.push({
            position_id: Number(values.second_choice_position),
            priority: 2,
          });
        if (values.third_choice_position)
          positionSelections.push({
            position_id: Number(values.third_choice_position),
            priority: 3,
          });
      }

      await upsertReturningExecSubmission({
        term_id: "",
        email: values.email,
        full_name: values.full_name,
        discord: values.discord,
        past_positions: values.past_positions,
        interested_in_returning: isRet,
        not_returning_reason: isRet ? null : (values.not_returning_reason ?? null),
        in_person_next_term: values.in_person_next_term === "true",
        qualifications: values.qualifications ?? "",
        additional_notes: values.additional_notes ?? null,
        position_selections: positionSelections,
      });

      setSubmitted(true);
      toast.success(submitted ? "Response updated successfully" : "Response submitted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const positionOptions = positions.map((p) => ({
    value: String(p.position_id),
    label: p.name,
  }));

  const optionalPositionSelectOptions = [
    { value: NO_POSITION_SELECT_VALUE, label: "None" },
    ...positionOptions,
  ];

  const submitButtonLoadingText = submitted ? "Updating..." : "Submitting...";
  const submitButtonIdleText = submitted ? "Update Response" : "Submit";

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold">Returning Exec Form</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Let us know whether you&apos;re interested in returning next term.
          {submitted && " Your response has been saved — you can update it anytime."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </form>
      </Form>
    </div>
  );
}
