"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowRight,
  CircleCheckBig,
  GraduationCap,
  OctagonX,
  RotateCcw,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import type { PlanPerson, PreviewMember } from "@uwdsc/common/recruiting";
import type { FinalizeView } from "@uwdsc/common/types";
import { Button, cn, Spinner, Tooltip, TooltipContent, TooltipTrigger } from "@uwdsc/ui";
import { FINALIZE_KEY, getFinalize } from "@/lib/api";
import { PersonAvatar } from "../leadership/PersonAvatar";
import { FinalizeDialog } from "./FinalizeDialog";

/** Recruiting → Finalize: before/after view of the team, then one confirm. */
export function FinalizePage() {
  const { data, error, isLoading } = useSWR<FinalizeView, Error>(FINALIZE_KEY, getFinalize, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
  const [open, setOpen] = useState(false);

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
        Couldn&apos;t load Finalize: {error?.message ?? "unknown error"}
      </div>
    );
  }

  if (data.finalizedAt) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-10 text-center">
        <CircleCheckBig className="size-8 text-emerald-600" aria-hidden />
        <h2 className="text-lg font-semibold">The {data.targetTermLabel} team is finalized</h2>
        <p className="text-sm text-muted-foreground">
          Finalized{" "}
          {new Date(data.finalizedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          . Roles are updated and the team page shows the new team.
        </p>
      </div>
    );
  }

  const { stats } = data;
  const changed = data.returning.filter((person) => person.from).length;

  return (
    <div className="flex flex-col gap-6 pb-6">
      {data.blockers.length > 0 && (
        <Banner tone="error" icon={OctagonX} title="Can't finalize yet">
          <ul className="list-disc pl-4">
            {data.blockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
        </Banner>
      )}

      {data.pending.length > 0 && (
        <Banner
          tone="warn"
          icon={TriangleAlert}
          title={`${data.pending.length} offer${data.pending.length === 1 ? " is" : "s are"} still unanswered`}
          action={
            <Button variant="outline" size="sm" asChild>
              <Link href="/recruiting/offers">View offers</Link>
            </Button>
          }
        >
          {data.pending.map((offer) => `${offer.name} (${offer.positionName})`).join(", ")}. If
          you finalize now, those offers close and the seats stay empty.
        </Banner>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Today's team"
          value={stats.currentCount}
          detail="people on the team page"
        />
        <Stat
          label={`${data.targetTermLabel} team`}
          value={stats.nextCount}
          detail={
            stats.pendingCount > 0
              ? `${stats.nextCount + stats.pendingCount} if pending offers are accepted`
              : "presidents, VPs and execs"
          }
        />
        <Stat
          label="Changes"
          value={`+${stats.newCount} / −${stats.leavingCount}`}
          detail="new execs / leaving"
        />
        <Stat
          label="Seats filled"
          value={`${stats.seatsFilled} of ${stats.seatsTotal}`}
          detail={
            stats.pendingCount > 0
              ? `${stats.pendingCount} waiting on a reply`
              : "exec positions"
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Group
          icon={UserPlus}
          title="New execs"
          count={`${data.newExecs.length}`}
          people={data.newExecs}
        />
        <Group
          icon={RotateCcw}
          title="Returning"
          count={`${data.returning.length}${changed ? ` · ${changed} with a new role` : ""}`}
          people={data.returning}
        />
        <Group
          icon={GraduationCap}
          title="Leaving → alum"
          count={`${data.leaving.length}`}
          people={data.leaving}
        />
      </div>

      <section aria-labelledby="tp-h" className="rounded-lg border">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b px-4 py-3">
          <h2 id="tp-h" className="text-sm font-semibold">
            Team page preview
          </h2>
          <span className="text-xs text-muted-foreground">
            uwdatascience.ca/team · goes live when you finalize
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden
              className="size-3 rounded border border-dashed border-muted-foreground"
            />
            Dashed = offer not answered yet
          </span>
        </div>
        <div className="flex flex-col gap-5 p-4">
          <PreviewRow title="Presidents" members={data.preview.presidents} />
          <PreviewRow title="Vice presidents" members={data.preview.vps} />
          <PreviewRow title="Execs" members={data.preview.execs} />
        </div>
      </section>

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-lg border bg-background/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">
            Ready to switch over to {data.targetTermLabel}?
          </div>
          <div className="text-xs text-muted-foreground">
            Finalizing gives new execs their roles, moves leaving members to alum and publishes
            the team page.
          </div>
        </div>
        {data.blockers.length > 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex">
                <Button disabled>
                  <CircleCheckBig aria-hidden />
                  Finalize team
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>{data.blockers[0]}</TooltipContent>
          </Tooltip>
        ) : (
          <Button onClick={() => setOpen(true)}>
            <CircleCheckBig aria-hidden />
            Finalize team
          </Button>
        )}
      </div>

      <FinalizeDialog view={data} open={open} onOpenChange={setOpen} />
    </div>
  );
}

function Banner({
  tone,
  icon: Icon,
  title,
  action,
  children,
}: {
  readonly tone: "warn" | "error";
  readonly icon: typeof TriangleAlert;
  readonly title: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-wrap items-start gap-3 rounded-lg px-4 py-3 text-[13px] ring-1 ring-inset",
        tone === "warn"
          ? "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900"
          : "bg-destructive/10 text-destructive ring-destructive/30"
      )}
    >
      <Icon className="mt-0.5 size-4 flex-none" aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{title}</div>
        <div className="mt-0.5">{children}</div>
      </div>
      {action}
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  readonly label: string;
  readonly value: ReactNode;
  readonly detail: string;
}) {
  return (
    <div className="rounded-lg border px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{detail}</div>
    </div>
  );
}

function Group({
  icon: Icon,
  title,
  count,
  people,
}: {
  readonly icon: typeof UserPlus;
  readonly title: string;
  readonly count: string;
  readonly people: readonly PlanPerson[];
}) {
  return (
    <section className="flex flex-col rounded-lg border">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <Icon className="size-3.5" aria-hidden />
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      <ul className="flex max-h-96 flex-col overflow-y-auto py-1">
        {people.length === 0 && (
          <li className="px-4 py-4 text-sm text-muted-foreground">No one</li>
        )}
        {people.map((person) => (
          <li key={person.profileId} className="flex items-center gap-2.5 px-4 py-1.5">
            <PersonAvatar name={person.name} className="size-7 text-[10px]" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium">{person.name}</div>
              <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                {person.from && (
                  <>
                    <span className="truncate">{person.from}</span>
                    <ArrowRight className="size-3 flex-none" aria-hidden />
                  </>
                )}
                <span className={cn("truncate", person.from && "text-foreground")}>
                  {person.role}
                </span>
              </div>
            </div>
            {person.from && (
              <span className="rounded bg-primary/10 px-1.5 text-[11px] font-medium text-primary">
                New role
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PreviewRow({
  title,
  members,
}: {
  readonly title: string;
  readonly members: readonly PreviewMember[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">No one yet</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <div
              key={`${member.name}-${member.role}`}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2",
                member.pending && "border-dashed opacity-75"
              )}
            >
              <PersonAvatar name={member.name} className="size-7 text-[10px]" />
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{member.name}</div>
                <div className="truncate text-xs text-muted-foreground">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
