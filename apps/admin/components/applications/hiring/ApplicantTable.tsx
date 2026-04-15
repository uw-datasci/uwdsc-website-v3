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
} from "@uwdsc/ui";
import { cn } from "@uwdsc/ui/lib/utils";
import type { ApplicationReviewStatus, HiringApplicant } from "@uwdsc/common/types";
import { flattenApplicantsToSelectionRows } from "@uwdsc/common/utils";
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

export function ApplicantTable({
  applicants,
  updatingSelectionId,
  onSelectionStatusChange,
}: Readonly<ApplicantTableProps>) {
  const rows = flattenApplicantsToSelectionRows(applicants);

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
              <TableHead className={`min-w-[240px] ${headCell}`}>Applicant</TableHead>
              <TableHead className={`min-w-[180px] ${headCell}`}>Role</TableHead>
              <TableHead className={`w-[140px] ${headCell}`}>Status</TableHead>
              <TableHead className={`w-14 ${headCell}`}>
                <span className="sr-only">Row actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ applicant, selection }) => {
              const roleLabel = selection.subteam_name
                ? `${selection.position_name} (${selection.subteam_name})`
                : selection.position_name;
              return (
                <TableRow key={selection.id}>
                  <TableCell className={bodyCell}>
                    <div className="flex max-w-[320px] flex-col gap-0.5">
                      <span className="font-medium leading-tight">{applicant.full_name}</span>
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
                        reviewStatusBadgeClassName(selection.status),
                      )}
                    >
                      {selection.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right ${bodyCell}`}>
                    <ApplicantRowActionsMenu
                      selectionId={selection.id}
                      selectionStatus={selection.status}
                      applicantName={applicant.full_name}
                      roleLabel={roleLabel}
                      disabled={updatingSelectionId === selection.id}
                      onConfirmStatus={onSelectionStatusChange}
                    />
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
