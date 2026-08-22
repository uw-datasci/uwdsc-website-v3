"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DateTimePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@uwdsc/ui";
import type { Term } from "@uwdsc/common/types";
import {
  HARD_DEADLINE_GRACE_MINUTES,
  termScheduleSchema,
  type TermScheduleFormValues,
} from "@/lib/schemas/termSchedule";
import {
  EVENT_TIMEZONE_LABEL,
  pickerValueToUtcIso,
  utcIsoToPickerValue,
} from "@/lib/utils/events";

interface TermScheduleCardProps {
  readonly term: Term;
  readonly saving: boolean;
  readonly onSave: (values: TermScheduleFormValues) => Promise<Term>;
}

function fromTerm(term: Term): TermScheduleFormValues {
  return {
    application_release_date: term.application_release_date ?? "",
    application_soft_deadline: term.application_soft_deadline ?? "",
    application_hard_deadline: term.application_hard_deadline ?? "",
  };
}

/** Minutes between two ISO timestamps, or null if either is missing/unparseable. */
function minutesBetween(fromIso: string, toIso: string): number | null {
  const from = Date.parse(fromIso);
  const to = Date.parse(toIso);
  if (Number.isNaN(from) || Number.isNaN(to)) return null;
  return Math.round((to - from) / 60000);
}

/** "45 minutes" under an hour, "1h 5m" (or "2h") at or above an hour. */
function formatGraceDuration(minutes: number): string {
  if (Math.abs(minutes) < 60) return `${minutes} minute${Math.abs(minutes) === 1 ? "" : "s"}`;
  const hours = Math.trunc(minutes / 60);
  const remainder = Math.abs(minutes % 60);
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}

export function TermScheduleCard({ term, saving, onSave }: TermScheduleCardProps) {
  const form = useForm<TermScheduleFormValues>({
    resolver: zodResolver(termScheduleSchema),
    mode: "onChange",
    defaultValues: fromTerm(term),
  });

  useEffect(() => {
    form.reset(fromTerm(term));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const [softDeadline, hardDeadline] = useWatch({
    control: form.control,
    name: ["application_soft_deadline", "application_hard_deadline"],
  });
  const graceMinutes =
    softDeadline && hardDeadline ? minutesBetween(softDeadline, hardDeadline) : null;

  /**
   * If the newly-picked soft deadline leaves the hard deadline less than the
   * grace window away (or the hard deadline is unset), push the hard
   * deadline out to soft + grace instead of leaving an invalid combination
   * for the president to notice only via the error message. Never touches
   * the hard deadline when the existing gap is already valid.
   */
  const handleSoftDeadlineChange = (softIso: string) => {
    if (!softIso) return;
    const softMs = Date.parse(softIso);
    if (Number.isNaN(softMs)) return;

    const graceMs = HARD_DEADLINE_GRACE_MINUTES * 60 * 1000;
    const currentHard = form.getValues("application_hard_deadline");
    const hardMs = currentHard ? Date.parse(currentHard) : Number.NaN;

    if (Number.isNaN(hardMs) || hardMs - softMs < graceMs) {
      form.setValue("application_hard_deadline", new Date(softMs + graceMs).toISOString(), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (values: TermScheduleFormValues) => {
    try {
      const persisted = await onSave(values);
      // The trigger may clamp the hard deadline -- reset from the server's
      // truth rather than trusting what was submitted.
      form.reset(fromTerm(persisted));
    } catch {
      // onSave already surfaced a toast; keep the form dirty so nothing is lost.
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Deadlines</CardTitle>
        <CardDescription>
          The soft deadline is shown to applicants and the hard deadline is the real cutoff. The
          apply page and every application API stop accepting requests once it passes.
          Backdating the hard deadline closes the cycle immediately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              All times are in {EVENT_TIMEZONE_LABEL}.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="application_release_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ? utcIsoToPickerValue(field.value) : ""}
                        onChange={(value) =>
                          field.onChange(value ? pickerValueToUtcIso(value) : "")
                        }
                        placeholder="MM/DD/YYYY HH:MM"
                      />
                    </FormControl>
                    {/* Fixed-height slot so an error in one column doesn't grow that
                        grid row while the other two stay put. */}
                    <div className="min-h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="application_soft_deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soft deadline</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ? utcIsoToPickerValue(field.value) : ""}
                        onChange={(value) => {
                          const iso = value ? pickerValueToUtcIso(value) : "";
                          field.onChange(iso);
                          handleSoftDeadlineChange(iso);
                        }}
                        placeholder="MM/DD/YYYY HH:MM"
                      />
                    </FormControl>
                    <div className="min-h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="application_hard_deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hard deadline</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value ? utcIsoToPickerValue(field.value) : ""}
                        onChange={(value) =>
                          field.onChange(value ? pickerValueToUtcIso(value) : "")
                        }
                        placeholder="MM/DD/YYYY HH:MM"
                      />
                    </FormControl>
                    <div className="min-h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {graceMinutes !== null && (
              <p className="text-sm text-muted-foreground">
                {graceMinutes >= HARD_DEADLINE_GRACE_MINUTES
                  ? `${formatGraceDuration(graceMinutes)} grace window between the soft and hard deadlines.`
                  : `Must be at least ${HARD_DEADLINE_GRACE_MINUTES} minutes — currently ${formatGraceDuration(graceMinutes)} — to set the hard deadline.`}
              </p>
            )}

            <div>
              <Button
                type="submit"
                className="rounded-md"
                disabled={!form.formState.isDirty || !form.formState.isValid || saving}
              >
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save schedule
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
