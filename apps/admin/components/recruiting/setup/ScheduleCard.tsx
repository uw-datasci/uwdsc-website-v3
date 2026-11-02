"use client";

import { MAX_OFFER_RESPONSE_HOURS } from "@uwdsc/common/constants";
import { useState } from "react";
import { toast } from "sonner";
import { scheduleSchema } from "@uwdsc/common/schemas";
import type { SetupView } from "@uwdsc/common/types";
import { formatTermCode } from "@uwdsc/common/utils";
import {
  Button,
  Card,
  DateTimePicker,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@uwdsc/ui";
import { SCHEDULE_DATE_FIELDS } from "@/constants/recruiting";
import { updateSchedule } from "@/lib/api";
import {
  EVENT_TIMEZONE_LABEL,
  formatDateTime,
  pickerValueToUtcIso,
  utcIsoToPickerValue,
} from "@/lib/utils/events";

interface ScheduleCardProps {
  readonly view: SetupView;
  readonly onSaved: () => Promise<void>;
}

export function ScheduleCard({ view, onSaved }: ScheduleCardProps) {
  const { schedule, canEditSchedule } = view;
  const [values, setValues] = useState({
    releaseDate: schedule.releaseDate ?? "",
    softDeadline: schedule.softDeadline ?? "",
    hardDeadline: schedule.hardDeadline ?? "",
    targetTermId: schedule.targetTermId,
    offerResponseHours: String(schedule.offerResponseHours),
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    const parsed = scheduleSchema.safeParse({
      ...values,
      offerResponseHours: Number(values.offerResponseHours),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the schedule");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await updateSchedule(parsed.data);
      toast.success("Schedule saved");
      await onSaved();
    } catch (err) {
      toast.error((err as Error).message || "Couldn't save the schedule");
    } finally {
      setIsSaving(false);
    }
  };

  const targetOptions = view.targetTerms.some((term) => term.id === schedule.targetTermId)
    ? view.targetTerms
    : [{ id: schedule.targetTermId, code: schedule.targetTermCode }, ...view.targetTerms];

  return (
    <Card className="gap-0 py-0" data-tour="schedule">
      <div className="border-b px-5 py-4">
        <h3 className="text-[15px] font-semibold">Schedule</h3>
        <p className="text-sm text-muted-foreground">
          Applications are collected in {formatTermCode(schedule.termCode)}. Times are{" "}
          {EVENT_TIMEZONE_LABEL}.{canEditSchedule ? "" : " Presidents set the dates."}
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {SCHEDULE_DATE_FIELDS.map(({ key, label, help }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            {canEditSchedule ? (
              <DateTimePicker
                value={values[key] ? utcIsoToPickerValue(values[key]) : ""}
                onChange={(value) =>
                  setValues((v) => ({ ...v, [key]: value ? pickerValueToUtcIso(value) : "" }))
                }
                placeholder="MM/DD/YYYY HH:MM"
              />
            ) : (
              <p className="text-sm">{values[key] ? formatDateTime(values[key]) : "Not set"}</p>
            )}
            <p className="text-xs text-muted-foreground">{help}</p>
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="target-term">Hiring for</Label>
          {canEditSchedule ? (
            <Select
              value={values.targetTermId}
              onValueChange={(targetTermId) => setValues((v) => ({ ...v, targetTermId }))}
            >
              <SelectTrigger id="target-term" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {targetOptions.map((term) => (
                  <SelectItem key={term.id} value={term.id}>
                    {formatTermCode(term.code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm">{formatTermCode(schedule.targetTermCode)}</p>
          )}
          <p className="text-xs text-muted-foreground">The term new execs join.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="offer-window">Offer window (hours)</Label>
          {canEditSchedule ? (
            <Input
              id="offer-window"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_OFFER_RESPONSE_HOURS}
              value={values.offerResponseHours}
              onChange={(event) =>
                setValues((v) => ({ ...v, offerResponseHours: event.target.value }))
              }
            />
          ) : (
            <p className="text-sm">{schedule.offerResponseHours} hours</p>
          )}
          <p className="text-xs text-muted-foreground">
            How long candidates have to answer an offer.
          </p>
        </div>
      </div>

      {canEditSchedule && (
        <div className="flex flex-wrap items-center justify-end gap-3 border-t px-5 py-3">
          {error && <p className="mr-auto text-sm text-destructive">{error}</p>}
          <Button disabled={isSaving} onClick={save}>
            {isSaving && <Spinner className="size-4" />}
            Save schedule
          </Button>
        </div>
      )}
    </Card>
  );
}
