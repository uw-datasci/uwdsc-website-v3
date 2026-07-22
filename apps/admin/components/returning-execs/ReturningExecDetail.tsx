"use client";

import type { ReactNode } from "react";
import {
  Badge,
  Card,
  ScrollArea,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@uwdsc/ui";
import { Mail, MessageSquare, User } from "lucide-react";
import {
  IN_PERSON_NEXT_TERM_LABELS,
  type ApplicationReviewStatus,
  type ReturningExecListItem,
  type ReturningExecPositionSelection,
} from "@uwdsc/common/types";
import { VP_REVIEW_STATUS_LIST, VP_REVIEW_STATUS_SET } from "@/constants/applications";
import { reviewStatusBadgeClassName } from "@/lib/utils/applications";
import type { PositionReviewScopeDto } from "@/types/applications";

interface ReturningExecDetailProps {
  submission: ReturningExecListItem | null;
  positionReview?: PositionReviewScopeDto | null;
  onSelectionStatusChange?: (
    selectionId: string,
    status: ApplicationReviewStatus,
  ) => void | Promise<void>;
  updatingSelectionId?: string | null;
}

export function ReturningExecDetail({
  submission,
  positionReview = null,
  onSelectionStatusChange,
  updatingSelectionId = null,
}: Readonly<ReturningExecDetailProps>) {
  if (!submission) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <User className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">Select a submission to view details</p>
        </div>
      </div>
    );
  }

  const vpTeamPositionIds = new Set(positionReview?.vpPositionIds ?? []);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{submission.full_name}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Submitted{" "}
            {new Date(submission.submitted_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Separator />

        {/* Basic info */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={submission.email}
            />
            <InfoItem
              icon={<MessageSquare className="h-4 w-4" />}
              label="Discord"
              value={submission.discord}
            />
          </div>
        </div>

        <Separator />

        {/* Past positions */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Past Positions &amp; Terms</h3>
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {submission.past_positions}
            </p>
          </div>
        </div>

        <Separator />

        {/* Returning interest */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Return Interest</h3>
          <Badge
            variant={
              submission.interested_in_returning
                ? "default"
                : submission.interested_in_future_term
                  ? "outline"
                  : "secondary"
            }
          >
            {submission.interested_in_returning
              ? "Interested in returning"
              : submission.interested_in_future_term
                ? `Interested in ${submission.interested_in_future_term}`
                : "Not returning"}
          </Badge>
          {submission.not_returning_reason && (
            <div className="mt-3 rounded-md bg-muted/50 p-3">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {submission.not_returning_reason}
              </p>
            </div>
          )}
        </div>

        {(submission.interested_in_returning || !!submission.interested_in_future_term) && (
          <>
            <Separator />

            {/* Position selections */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Role Preferences</h3>
              {submission.position_selections.length === 0 ? (
                <p className="text-sm text-muted-foreground">No positions selected.</p>
              ) : (
                <div className="space-y-2">
                  {submission.position_selections.map((sel) => (
                    <ReturningExecPositionSelectionCard
                      key={sel.id}
                      sel={sel}
                      vpApaIds={vpTeamPositionIds}
                      positionReview={positionReview}
                      onSelectionStatusChange={onSelectionStatusChange}
                      updatingSelectionId={updatingSelectionId}
                    />
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* In-person */}
            <div>
              <h3 className="text-sm font-semibold mb-2">
                {submission.interested_in_future_term
                  ? `In Person in ${submission.interested_in_future_term}`
                  : "In Person Next Term"}
              </h3>
              <Badge
                variant={submission.in_person_next_term === "yes" ? "default" : "secondary"}
              >
                {submission.in_person_next_term
                  ? IN_PERSON_NEXT_TERM_LABELS[submission.in_person_next_term]
                  : "—"}
              </Badge>
            </div>

            <Separator />

            {/* Qualifications */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Why Interested / Qualified</h3>
              <div className="rounded-md bg-muted/50 p-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {submission.qualifications}
                </p>
              </div>
            </div>
          </>
        )}

        {submission.additional_notes && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold mb-2">Additional Notes</h3>
              <div className="rounded-md bg-muted/50 p-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {submission.additional_notes}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}

interface ReturningExecPositionSelectionCardProps {
  readonly sel: ReturningExecPositionSelection;
  readonly vpApaIds: ReadonlySet<number>;
  readonly positionReview: PositionReviewScopeDto | null | undefined;
  readonly onSelectionStatusChange?: (
    selectionId: string,
    status: ApplicationReviewStatus,
  ) => void | Promise<void>;
  readonly updatingSelectionId: string | null | undefined;
}

function ReturningExecPositionSelectionCard({
  sel,
  vpApaIds,
  positionReview,
  onSelectionStatusChange,
  updatingSelectionId,
}: ReturningExecPositionSelectionCardProps) {
  const statusAllowsVpEdit = VP_REVIEW_STATUS_SET.has(sel.status);
  const canEdit =
    !!positionReview?.canUse &&
    !!onSelectionStatusChange &&
    (positionReview.isPresident || vpApaIds.has(sel.position_id)) &&
    statusAllowsVpEdit;
  const showReadOnly = !!positionReview?.canUse && !canEdit;

  let statusControl: ReactNode = null;
  if (canEdit) {
    statusControl = (
      <Select
        value={sel.status}
        onValueChange={(v) => onSelectionStatusChange?.(sel.id, v as ApplicationReviewStatus)}
        disabled={updatingSelectionId === sel.id}
      >
        <SelectTrigger
          className={cn(
            "h-8 w-[11.5rem] shrink-0 text-xs font-medium",
            reviewStatusBadgeClassName(sel.status),
          )}
        >
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {VP_REVIEW_STATUS_LIST.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  } else if (showReadOnly) {
    statusControl = (
      <Badge
        variant="outline"
        className={cn(
          "shrink-0 text-xs font-medium max-w-[11.5rem] truncate",
          reviewStatusBadgeClassName(sel.status),
        )}
        title={sel.status}
      >
        {sel.status}
      </Badge>
    );
  }

  return (
    <Card className="p-3 gap-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-muted-foreground w-5 shrink-0">
            #{sel.priority}
          </span>
          <span className="font-medium text-sm truncate">{sel.position_name}</span>
        </div>
        {statusControl}
      </div>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: Readonly<InfoItemProps>) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate">{value}</p>
      </div>
    </div>
  );
}
