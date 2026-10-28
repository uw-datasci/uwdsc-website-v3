"use client";

import useSWR from "swr";
import type { OverviewView } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";
import { getOverview, OVERVIEW_KEY } from "@/lib/api";
import { StatusDot } from "../board/StatusBadge";
import { useTour } from "../tour";
import { AttentionList } from "./AttentionList";
import { ChecklistCard } from "./ChecklistCard";
import { PhaseStepper } from "./PhaseStepper";
import { RoleSeats } from "./RoleSeats";

/** Recruiting → Overview: where the cycle is, what needs attention, the checklist and seats. */
export function OverviewPage() {
  const tour = useTour();
  const { data, error, isLoading } = useSWR<OverviewView, Error>(OVERVIEW_KEY, getOverview, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Couldn&apos;t load the overview: {error?.message ?? "unknown error"}
      </div>
    );
  }

  const checklist = data.checklist.map((item) =>
    item.id === "tour" ? { ...item, done: tour.completed } : item
  );

  return (
    <div className="flex flex-col gap-6 pb-6">
      <PhaseStepper
        steps={data.steps}
        stepNumber={data.stepNumber}
        stepLabel={data.stepLabel}
        summary={data.summary}
      />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {data.counts.map((count) => (
          <div key={count.key} className="rounded-lg border px-4 py-3">
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {count.status && <StatusDot status={count.status} />}
              {count.label}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
              {count.value}
            </dd>
            <dd className="truncate text-xs text-muted-foreground">{count.sub}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <AttentionList items={data.attention} />
        <div className="flex flex-col gap-6">
          <ChecklistCard items={checklist} onStartTour={tour.start} />
          <RoleSeats roles={data.roles} />
        </div>
      </div>
    </div>
  );
}
