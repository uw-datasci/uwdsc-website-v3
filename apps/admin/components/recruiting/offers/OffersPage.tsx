"use client";

import { useState, type ReactNode } from "react";
import useSWR from "swr";
import { Check, MailX, MoreHorizontal, RotateCw, Send, Undo2, X } from "lucide-react";
import type { OfferRow, OffersView, ReadyRow } from "@uwdsc/common/types";
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uwdsc/ui";
import { useOfferResponse } from "@/hooks/useOfferActions";
import { getOffers, OFFERS_KEY } from "@/lib/api";
import { formatActivityTime, offerTimeLeft, ordinal } from "@/lib/utils/recruiting";
import { PersonAvatar } from "../leadership/PersonAvatar";
import { RejectBatchDialog } from "./RejectBatchDialog";
import { SendOfferDialog, type OfferTarget } from "./SendOfferDialog";
import { WithdrawOfferDialog, type WithdrawTarget } from "./WithdrawOfferDialog";

/** Recruiting → Offers: who's ready, who's been sent one, who responded. */
export function OffersPage() {
  const { data, error, isLoading } = useSWR<OffersView, Error>(OFFERS_KEY, getOffers, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
  const respond = useOfferResponse();
  const [now] = useState(() => Date.now());
  const [offerTarget, setOfferTarget] = useState<OfferTarget | null>(null);
  const [withdrawTarget, setWithdrawTarget] = useState<WithdrawTarget | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);

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
        Couldn&apos;t load offers: {error?.message ?? "unknown error"}
      </div>
    );
  }

  const readyRows = [
    ...data.ready.flatMap((group) => group.rows),
    ...data.conflicts.flatMap((c) => c.rows),
  ];
  const canGo = readyRows.filter((row) => !row.blocker).length;
  const accepted = data.responded.filter((row) => row.status === "Accepted Offer").length;
  const offerTo = (row: OfferRow, mode: OfferTarget["mode"]) =>
    setOfferTarget({
      selectionId: row.selectionId,
      name: row.name,
      email: row.email,
      positionName: row.positionName,
      subteamName: row.subteamName,
      mode,
      personalLine: mode === "resend" ? row.personalLine : null,
    });
  const offer = (row: OfferRow) => offerTo(row, "send");
  const actions: OfferActions = {
    respond,
    resend: (row) => offerTo(row, "resend"),
    withdraw: (row) =>
      setWithdrawTarget({
        selectionId: row.selectionId,
        name: row.name,
        email: row.email,
        positionName: row.positionName,
      }),
  };

  const nav = [
    { href: "#ready", label: "Ready to offer", count: readyRows.length },
    { href: "#sent", label: "Sent", count: data.sent.length },
    { href: "#responded", label: "Responded", count: data.responded.length },
    { href: "#expired", label: "Expired", count: data.expired.length, error: true },
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-wrap items-center gap-2">
        <nav aria-label="Jump to section" className="flex flex-wrap gap-1.5">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[13px] text-muted-foreground hover:text-foreground",
                item.error && item.count > 0 && "border-destructive/40 text-destructive"
              )}
            >
              {item.label} <strong className="ml-1 tabular-nums">{item.count}</strong>
            </a>
          ))}
        </nav>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => setBatchOpen(true)}
        >
          <MailX aria-hidden />
          Send rejections
        </Button>
      </div>

      <section
        id="ready"
        aria-labelledby="ready-h"
        data-tour="offers-ready"
        className="flex flex-col gap-3"
      >
        <SectionHeader id="ready-h" title="Ready to offer">
          {readyRows.length} Wanted · {canGo} can go now
          {readyRows.length - canGo > 0 ? `, ${readyRows.length - canGo} waiting` : ""}
        </SectionHeader>

        {data.conflicts.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-amber-300 dark:border-amber-900">
            <div className="bg-amber-50 px-4 py-2 text-[13px] font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              Conflicts · Wanted by two subteams. Accepting one offer declines the others.
            </div>
            <ul>
              {data.conflicts.map((conflict) => (
                <li
                  key={conflict.applicationId}
                  className="flex flex-wrap items-center gap-3 border-t px-4 py-2.5"
                >
                  <PersonAvatar name={conflict.name} className="size-7 text-[10px]" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium">{conflict.name}</div>
                    <div className="text-xs text-muted-foreground">{conflict.program}</div>
                  </div>
                  {conflict.rows.map((row) => (
                    <OfferButton
                      key={row.selectionId}
                      row={row}
                      onOffer={offer}
                      variant="outline"
                    >
                      Offer {row.positionName}
                      <span className="text-[11px] text-muted-foreground">
                        {ordinal(row.priority)}
                      </span>
                    </OfferButton>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.ready.length === 0 && data.conflicts.length === 0 && (
          <EmptyState>
            No one is Wanted yet. VPs move candidates to Wanted on the Board.
          </EmptyState>
        )}

        {data.ready.map((group) => (
          <div key={group.subteamName} className="overflow-hidden rounded-lg border">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b bg-muted/40 px-4 py-2">
              <h3 className="text-sm font-semibold">{group.subteamName}</h3>
              <span className="text-xs text-muted-foreground">
                {group.seats
                  .map((seat) =>
                    seat.left > 0
                      ? `${seat.positionName} ${seat.left} seat${seat.left === 1 ? "" : "s"} left`
                      : `${seat.positionName} full${seat.heldBy.length ? ` until ${seat.heldBy.join(", ")} replies` : ""}`
                  )
                  .join(" · ")}
              </span>
            </div>
            <ul>
              {group.rows.map((row) => (
                <li
                  key={row.selectionId}
                  className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-3 border-b px-4 py-2.5 last:border-b-0"
                >
                  <Person name={row.name} detail={row.program} />
                  <div className="flex min-w-0 items-center gap-1.5 text-[13px]">
                    <span className="truncate">{row.positionName}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {ordinal(row.priority)}
                    </span>
                    {row.returning && (
                      <span className="rounded px-1.5 text-[11px] font-medium ring-1 ring-border ring-inset">
                        Returning
                      </span>
                    )}
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {row.blocker ??
                      `Wanted by ${row.wantedBy ?? "a VP"}${row.wantedAt ? ` · ${formatActivityTime(row.wantedAt)}` : ""}`}
                  </span>
                  <OfferButton row={row} onOffer={offer}>
                    <Send aria-hidden />
                    Send offer
                  </OfferButton>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="sent" aria-labelledby="sent-h" className="flex flex-col gap-3">
          <SectionHeader id="sent-h" title="Sent">
            Waiting on a reply · {data.offerResponseHours}h each
          </SectionHeader>
          {data.sent.length === 0 ? (
            <EmptyState>No offers out. Send one from Ready to offer above.</EmptyState>
          ) : (
            <ul className="overflow-hidden rounded-lg border">
              {data.sent.map((row) => {
                const left = offerTimeLeft(row.expiresAt ?? "", data.offerResponseHours, now);
                return (
                  <li
                    key={row.selectionId}
                    className="flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0"
                  >
                    <Person
                      name={row.name}
                      detail={`${row.positionName}${row.sentAt ? ` · sent ${formatActivityTime(row.sentAt)}` : ""}`}
                    />
                    <div className="flex w-36 flex-none flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-2 text-xs">
                        <span
                          className={cn(
                            "font-semibold",
                            left.urgent
                              ? "text-amber-700 dark:text-amber-300"
                              : "text-foreground"
                          )}
                        >
                          {left.label}
                        </span>
                        {row.expiresAt && (
                          <span className="truncate text-muted-foreground">
                            due {formatActivityTime(row.expiresAt)}
                          </span>
                        )}
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`Time left for ${row.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(left.fraction * 100)}
                        className="h-1 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className={cn(
                            "h-full rounded-full",
                            left.urgent ? "bg-amber-500" : "bg-primary"
                          )}
                          style={{ width: `${left.fraction * 100}%` }}
                        />
                      </div>
                    </div>
                    <ResponseMenu row={row} actions={actions} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-6">
          <section id="expired" aria-labelledby="exp-h" className="flex flex-col gap-3">
            <SectionHeader id="exp-h" title={`Expired · ${data.expired.length}`} tone="error">
              No reply within {data.offerResponseHours} hours
            </SectionHeader>
            {data.expired.length === 0 ? (
              <EmptyState>No expired offers.</EmptyState>
            ) : (
              <ul className="overflow-hidden rounded-lg border border-destructive/30">
                {data.expired.map((row) => (
                  <li
                    key={row.selectionId}
                    className="flex flex-wrap items-center gap-3 border-b px-4 py-2.5 last:border-b-0"
                  >
                    <Person
                      name={row.name}
                      detail={`${row.positionName}${row.expiresAt ? ` · expired ${formatActivityTime(row.expiresAt)}` : ""}`}
                    />
                    <Button size="sm" onClick={() => actions.resend(row)}>
                      <RotateCw aria-hidden />
                      Resend for {data.offerResponseHours}h
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void respond(row, "declined")}
                    >
                      Release seat
                    </Button>
                    <ResponseMenu row={row} actions={actions} expired />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="responded" aria-labelledby="resp-h" className="flex flex-col gap-3">
            <SectionHeader id="resp-h" title={`Responded · ${data.responded.length}`}>
              {accepted} accepted, {data.responded.length - accepted} declined
            </SectionHeader>
            {data.responded.length === 0 ? (
              <EmptyState>No replies yet. Answers by email link show up here.</EmptyState>
            ) : (
              <ul className="overflow-hidden rounded-lg border">
                {data.responded.map((row) => {
                  const detail = [
                    row.positionName,
                    row.respondedAt && formatActivityTime(row.respondedAt),
                    row.respondedVia === "link" && "via link",
                    row.responseNote,
                  ]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li
                      key={row.selectionId}
                      className="flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0"
                    >
                      <Person name={row.name} detail={detail} />
                      <ResponseBadge row={row} />
                      {row.withdrawn ? (
                        <span aria-hidden className="size-7" />
                      ) : (
                        <ResponseMenu row={row} actions={actions} />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>

      <SendOfferDialog target={offerTarget} onClose={() => setOfferTarget(null)} />
      <WithdrawOfferDialog target={withdrawTarget} onClose={() => setWithdrawTarget(null)} />
      <RejectBatchDialog open={batchOpen} onOpenChange={setBatchOpen} />
    </div>
  );
}

function SectionHeader({
  id,
  title,
  tone,
  children,
}: {
  readonly id: string;
  readonly title: string;
  readonly tone?: "error";
  readonly children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2
        id={id}
        className={cn("text-base font-semibold", tone === "error" && "text-destructive")}
      >
        {title}
      </h2>
      <span className="text-[13px] text-muted-foreground">{children}</span>
    </div>
  );
}

function Person({ name, detail }: { readonly name: string; readonly detail: string | null }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5">
      <PersonAvatar name={name} className="size-7 text-[10px]" />
      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium">{name}</div>
        {detail && <div className="truncate text-xs text-muted-foreground">{detail}</div>}
      </div>
    </div>
  );
}

function EmptyState({ children }: { readonly children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

function OfferButton({
  row,
  onOffer,
  variant,
  children,
}: {
  readonly row: ReadyRow;
  readonly onOffer: (row: OfferRow) => void;
  readonly variant?: "outline";
  readonly children: ReactNode;
}) {
  const button = (
    <Button size="sm" variant={variant} disabled={!!row.blocker} onClick={() => onOffer(row)}>
      {children}
    </Button>
  );
  if (!row.blocker) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>{button}</span>
      </TooltipTrigger>
      <TooltipContent>{row.blocker}</TooltipContent>
    </Tooltip>
  );
}

interface OfferActions {
  respond: (row: OfferRow, response: "accepted" | "declined") => Promise<void>;
  resend: (row: OfferRow) => void;
  withdraw: (row: OfferRow) => void;
}

function ResponseBadge({ row }: { readonly row: OfferRow }) {
  const isAccepted = row.status === "Accepted Offer";
  let tone = "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200";
  if (isAccepted)
    tone = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200";
  else if (row.withdrawn) tone = "bg-muted text-muted-foreground";

  let label = "Declined";
  if (isAccepted) label = "Accepted";
  else if (row.withdrawn) label = "Withdrawn";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
        tone
      )}
    >
      {isAccepted ? (
        <Check className="size-3" aria-hidden />
      ) : (
        <X className="size-3" aria-hidden />
      )}
      {label}
    </span>
  );
}

function ResponseMenu({
  row,
  actions,
  expired,
}: {
  readonly row: OfferRow;
  readonly actions: OfferActions;
  readonly expired?: boolean;
}) {
  const sent = row.status === "Offer Sent";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={`More actions for ${row.name}`}
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {row.status !== "Accepted Offer" && (
          <DropdownMenuItem onSelect={() => void actions.respond(row, "accepted")}>
            <Check aria-hidden />
            {sent ? "Mark accepted" : "Change to accepted"}
          </DropdownMenuItem>
        )}
        {row.status !== "Declined Offer" && !expired && (
          <DropdownMenuItem onSelect={() => void actions.respond(row, "declined")}>
            <X aria-hidden />
            {sent ? "Mark declined" : "Change to declined"}
          </DropdownMenuItem>
        )}
        {sent && (
          <>
            <DropdownMenuSeparator />
            {!expired && (
              <DropdownMenuItem onSelect={() => actions.resend(row)}>
                <RotateCw aria-hidden />
                Resend with new deadline
              </DropdownMenuItem>
            )}
            <DropdownMenuItem variant="destructive" onSelect={() => actions.withdraw(row)}>
              <Undo2 aria-hidden />
              Withdraw offer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
