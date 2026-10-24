"use client";

import useSWR from "swr";
import type { ActivityItem } from "@uwdsc/common/types";
import { Spinner } from "@uwdsc/ui";
import { getCandidateActivity } from "@/lib/api";
import { formatActivityTime } from "@/lib/utils/recruiting";
import { StatusBadge, StatusDot } from "../board/StatusBadge";

export const ACTIVITY_KEY = "/api/recruiting/activity";

function listNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

function ActivityRow({ item }: { readonly item: ActivityItem }) {
  if (item.type === "move") {
    return (
      <>
        <StatusDot status={item.to} className="mt-1.5" />
        <div className="flex flex-col gap-1">
          <p className="text-[13px]">
            <span className="font-medium">{item.actorName ?? "Someone"}</span>{" "}
            {item.undo ? "undid a move on" : "moved"} {item.positionName}
          </p>
          <div className="flex items-center gap-1.5">
            {item.from && <StatusBadge status={item.from} />}
            {item.from && <span className="text-xs text-muted-foreground">→</span>}
            <StatusBadge status={item.to} />
          </div>
          <p className="text-xs text-muted-foreground">{formatActivityTime(item.at)}</p>
        </div>
      </>
    );
  }

  const text =
    item.type === "note" ? (
      <>
        <span className="font-medium">{item.actorName ?? "Someone"}</span> added{" "}
        {item.kind === "interview" ? "an interview note" : "a note"}
      </>
    ) : (
      <>
        Applied for {listNames(item.positionNames) || "their positions"} through the public form
      </>
    );

  return (
    <>
      <span
        aria-hidden
        className="mt-1.5 size-2 flex-none rounded-full bg-muted-foreground/40"
      />
      <div className="flex flex-col gap-1">
        <p className="text-[13px]">{text}</p>
        <p className="text-xs text-muted-foreground">{formatActivityTime(item.at)}</p>
      </div>
    </>
  );
}

export function ActivityTab({ applicationId }: { readonly applicationId: string }) {
  const { data, error, isLoading } = useSWR<ActivityItem[], Error>(
    [ACTIVITY_KEY, applicationId],
    ([, id]: [string, string]) => getCandidateActivity(id),
    { shouldRetryOnError: false }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (error) {
    return (
      <p className="text-sm text-destructive">Couldn&apos;t load activity: {error.message}</p>
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {data?.map((item) => (
        <li key={`${item.type}-${item.id}`} className="flex gap-3">
          <ActivityRow item={item} />
        </li>
      ))}
    </ol>
  );
}
