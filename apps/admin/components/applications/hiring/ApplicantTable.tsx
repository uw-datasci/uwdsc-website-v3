"use client";

import { useCallback, useState } from "react";
import {
  Badge,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uwdsc/ui";
import { cn } from "@uwdsc/ui/lib/utils";
import type {
  ApplicationReviewStatus,
  HiringApplicant,
} from "@uwdsc/common/types";
import { flattenApplicantsToSelectionRows } from "@uwdsc/common/utils";
import { SelectionOutcomeEdit } from "./SelectionOutcomeEdit";
import { SendOfferButton, type SendOfferPhase } from "./SendOfferButton";

interface ApplicantTableProps {
  readonly applicants: HiringApplicant[];
  readonly updatingSelectionId: string | null;
  readonly onSelectionStatusChange: (
    selectionId: string,
    status: ApplicationReviewStatus,
  ) => void;
}

export function ApplicantTable({
  applicants,
  updatingSelectionId,
  onSelectionStatusChange,
}: ApplicantTableProps) {
  const rows = flattenApplicantsToSelectionRows(applicants);
  const [sendingOfferSelectionIds, setSendingOfferSelectionIds] = useState(
    () => new Set<string>(),
  );
  const [sentOfferSelectionIds, setSentOfferSelectionIds] = useState(
    () => new Set<string>(),
  );

  const sendOfferPhase = useCallback(
    (selectionId: string): SendOfferPhase => {
      if (sentOfferSelectionIds.has(selectionId)) return "success";
      if (sendingOfferSelectionIds.has(selectionId)) return "loading";
      return "idle";
    },
    [sentOfferSelectionIds, sendingOfferSelectionIds],
  );

  const handleSendOffer = useCallback(async (selectionId: string) => {
    setSendingOfferSelectionIds((prev) => new Set(prev).add(selectionId));
    try {
      // TODO: replace timeout with send-offer API call
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
      setSentOfferSelectionIds((prev) => new Set(prev).add(selectionId));
    } catch (error) {
      console.error("Error sending offer:", error);
    } finally {
      setSendingOfferSelectionIds((prev) => {
        const next = new Set(prev);
        next.delete(selectionId);
        return next;
      });
    }
  }, []);

  const statusBadgeClassName = (status: ApplicationReviewStatus): string => {
    switch (status) {
      case "Wanted":
        return "border-emerald-300 bg-emerald-100 text-emerald-900 border-emerald-800 bg-emerald-950/60 text-emerald-100";
      case "Accepted Offer":
        return "border-emerald-600 bg-emerald-600 text-white border-emerald-500 bg-emerald-500";
      case "Not Wanted":
        return "border-red-300 bg-red-100 text-red-900 border-red-800 bg-red-950/60 text-red-100";
      case "Rejection Sent":
        return "border-red-600 bg-red-600 text-white border-red-500 bg-red-500";
      case "Offer Sent":
        return "border-sky-300 bg-sky-100 text-sky-900 border-sky-800 bg-sky-950/60 text-sky-100";
      case "Declined Offer":
        return "border-blue-600 bg-blue-600 text-white border-blue-500 bg-blue-500";
      default:
        return "border-border bg-muted/60 text-muted-foreground";
    }
  };

  if (rows.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          No applicants with a &quot;Wanted&quot; role yet.
        </p>
      </div>
    );
  }

  /** Inset from card edges; first/last cells keep horizontal room so row hover reads inset */
  const headCell = "px-3 py-3 sm:px-4 first:pl-2 last:pr-2";
  const bodyCell = "px-3 py-2.5 align-middle sm:px-4 first:pl-2 last:pr-2";

  return (
    <ScrollArea className="h-full">
      <div className="min-w-0 px-4 py-2 sm:px-6 sm:py-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`min-w-[240px] ${headCell}`}>
                Applicant
              </TableHead>
              <TableHead className={`min-w-[180px] ${headCell}`}>
                Role
              </TableHead>
              <TableHead className={`w-[140px] ${headCell}`}>Status</TableHead>
              <TableHead className={`min-w-[240px] ${headCell}`}>
                <div className="flex w-full justify-end">Actions</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ applicant, selection }) => {
              const showSendOffer = selection.status === "Wanted";
              return (
                <TableRow key={selection.id}>
                  <TableCell className={bodyCell}>
                    <div className="flex max-w-[320px] flex-col gap-0.5">
                      <span className="font-medium leading-tight">
                        {applicant.full_name}
                      </span>
                      <span className="break-all text-sm leading-snug text-muted-foreground">
                        {applicant.personal_email ?? "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={bodyCell}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {selection.position_name}
                      </Badge>
                      {selection.subteam_name ? (
                        <span className="text-xs text-muted-foreground">
                          {selection.subteam_name}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className={bodyCell}>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        statusBadgeClassName(selection.status),
                      )}
                    >
                      {selection.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right ${bodyCell}`}>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {showSendOffer ? (
                        <SendOfferButton
                          phase={sendOfferPhase(selection.id)}
                          onSendOffer={() => handleSendOffer(selection.id)}
                        />
                      ) : null}
                      <SelectionOutcomeEdit
                        disabled={updatingSelectionId === selection.id}
                        onSelect={(status) =>
                          onSelectionStatusChange(selection.id, status)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
