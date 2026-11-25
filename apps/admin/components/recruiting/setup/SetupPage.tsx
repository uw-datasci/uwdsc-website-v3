"use client";

import useSWR from "swr";
import type { SetupView } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";
import { getSetup } from "@/lib/api";
import { PositionsCard } from "./PositionsCard";
import { QuestionsCard } from "./QuestionsCard";
import { ScheduleCard } from "./ScheduleCard";

/** Recruiting → Setup: dates, open positions and the question bank. */
export function SetupPage() {
  const { data, error, isLoading, mutate } = useSWR<SetupView, Error>(
    "/api/recruiting/setup",
    getSetup,
    { revalidateOnFocus: true, shouldRetryOnError: false }
  );

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
        Couldn&apos;t load setup: {error?.message ?? "unknown error"}
      </div>
    );
  }

  const refresh = async () => {
    await mutate();
  };

  return (
    <div className="flex flex-col gap-6 pb-4">
      <ScheduleCard key={JSON.stringify(data.schedule)} view={data} onSaved={refresh} />
      <PositionsCard view={data} onSaved={refresh} />
      <QuestionsCard view={data} onSaved={refresh} />
    </div>
  );
}
