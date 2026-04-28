"use client";

import {
  Badge,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uwdsc/ui";
import { cn } from "@uwdsc/ui/lib/utils";
import type {
  ApplicationReviewStatus,
  HiringApplicant,
  HiringPositionSelection,
} from "@uwdsc/common/types";
import { sortPositionSelectionsByPriority } from "@uwdsc/common/utils";
import { reviewStatusBadgeClassName } from "@/lib/utils/applications";
import { ApplicantRowActionsMenu } from "./RowActionsMenu";

interface ApplicantTableProps {
  applicants: HiringApplicant[];
  updatingSelectionId: string | null;
  onSelectionStatusChange: (
    selectionId: string,
    status: ApplicationReviewStatus,
  ) => Promise<void>;
}

const PRIORITY_LABEL: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" };

/** One line per role: `min-h-8` matches RowActionsMenu trigger (`size-8`) so columns stay aligned. */
const SELECTION_LINE_ROW = "flex min-h-8 items-center";
const SELECTION_LINE = `${SELECTION_LINE_ROW} gap-2`;
const SELECTION_STACK_GAP = "gap-2";

function SelectionRow({
  selection,
}: Readonly<{
  selection: HiringPositionSelection;
}>) {
  return (
    <div className={SELECTION_LINE}>
      <span className="inline-flex h-5 w-7 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground">
        {PRIORITY_LABEL[selection.priority] ?? `${selection.priority}`}
      </span>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="shrink-0 text-xs">
            {selection.position_name}
          </Badge>
        </TooltipTrigger>
        {selection.subteam_name ? (
          <TooltipContent side="top">{selection.subteam_name}</TooltipContent>
        ) : null}
      </Tooltip>
    </div>
  );
}

export function ApplicantTable({
  applicants,
  updatingSelectionId,
  onSelectionStatusChange,
}: Readonly<ApplicantTableProps>) {
  if (applicants.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          No applicants with a &quot;Wanted&quot; role yet.
        </p>
      </div>
    );
  }

  const headCell = "px-3 py-3 sm:px-4 first:pl-2 last:pr-2";
  const bodyCell = "px-3 py-2.5 align-top sm:px-4 first:pl-2 last:pr-2";

  return (
    <ScrollArea className="h-full">
      <div className="min-w-0 px-4 py-2 sm:px-6 sm:py-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`min-w-[240px] ${headCell}`}>Applicant</TableHead>
              <TableHead className={`min-w-[280px] ${headCell}`}>Positions</TableHead>
              <TableHead className={`w-[140px] ${headCell}`}>Status</TableHead>
              <TableHead className={`w-14 ${headCell}`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => {
              const sortedSelections = sortPositionSelectionsByPriority(
                applicant.position_selections,
              );
              return (
                <TableRow key={applicant.id}>
                  <TableCell className={bodyCell}>
                    <div className="flex max-w-[320px] flex-col gap-0.5">
                      <span className="font-medium leading-tight">{applicant.full_name}</span>
                      <span className="break-all text-xs leading-snug text-muted-foreground">
                        {applicant.email ?? "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={bodyCell}>
                    <div className={cn("flex flex-col", SELECTION_STACK_GAP)}>
                      {sortedSelections.map((selection) => (
                        <SelectionRow key={selection.id} selection={selection} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className={bodyCell}>
                    <div className={cn("flex flex-col", SELECTION_STACK_GAP)}>
                      {sortedSelections.map((selection) => (
                        <div key={selection.id} className={SELECTION_LINE_ROW}>
                          <Badge
                            variant="outline"
                            className={cn(
                              "shrink-0 text-xs font-medium",
                              reviewStatusBadgeClassName(selection.status),
                            )}
                          >
                            {selection.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right ${bodyCell}`}>
                    <div className={cn("flex flex-col", SELECTION_STACK_GAP)}>
                      {sortedSelections.map((selection) => {
                        const roleLabel = selection.subteam_name
                          ? `${selection.position_name} (${selection.subteam_name})`
                          : selection.position_name;
                        return (
                          <div
                            key={selection.id}
                            className={cn(SELECTION_LINE_ROW, "justify-end")}
                          >
                            <ApplicantRowActionsMenu
                              selectionId={selection.id}
                              selectionStatus={selection.status}
                              applicantName={applicant.full_name}
                              roleLabel={roleLabel}
                              disabled={updatingSelectionId === selection.id}
                              onConfirmStatus={onSelectionStatusChange}
                            />
                          </div>
                        );
                      })}
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
