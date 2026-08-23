"use client";

import { Check, ExternalLink, FileText, Loader2, X } from "lucide-react";
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@uwdsc/ui";
import type { SubmissionReviewItem } from "@uwdsc/common/types";

interface SubmissionReviewDrawerProps {
  readonly submission: SubmissionReviewItem | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onApprove: () => void;
  readonly onReject: () => void;
  readonly isSelf: boolean;
  readonly isSubmitting: boolean;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface FieldProps {
  readonly label: string;
  readonly claimed: string | null;
  readonly onFile: string | null;
}

/** Snapshot value beside the live profile value, so a mismatch is obvious. */
function Field({ label, claimed, onFile }: FieldProps) {
  const differs = (claimed ?? "") !== (onFile ?? "") && Boolean(onFile);

  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-words">{claimed || "—"}</p>
      {differs ? (
        <p className="text-xs text-amber-600 dark:text-amber-500">Profile says: {onFile}</p>
      ) : null}
    </div>
  );
}

export function SubmissionReviewDrawer({
  submission,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isSelf,
  isSubmitting,
}: SubmissionReviewDrawerProps) {
  if (!submission) return null;

  const isImage = submission.proof_mime_type?.startsWith("image/") ?? false;
  const isPending = submission.status === "pending";
  const profileName =
    [submission.profile_first_name, submission.profile_last_name].filter(Boolean).join(" ") ||
    null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {submission.first_name} {submission.last_name}
          </SheetTitle>
          <SheetDescription>
            Submitted {formatDate(submission.submitted_at)} · {submission.term_code}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isPending ? "outline" : "secondary"} className="capitalize">
              {submission.status}
            </Badge>
            <Badge variant="outline">
              {submission.source === "email" ? "Forwarded email" : "Web form"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First name"
              claimed={submission.first_name}
              onFile={submission.profile_first_name}
            />
            <Field
              label="Last name"
              claimed={submission.last_name}
              onFile={submission.profile_last_name}
            />
            <Field
              label="WatIAM"
              claimed={submission.wat_iam}
              onFile={submission.profile_wat_iam}
            />
            <Field
              label="Email"
              claimed={submission.contact_email}
              onFile={submission.profile_email}
            />
            <Field label="Program" claimed={submission.program} onFile={null} />
            <Field
              label="Term type"
              claimed={
                submission.is_coop_term === null
                  ? null
                  : submission.is_coop_term
                    ? "Co-op work term"
                    : "Study term"
              }
              onFile={null}
            />
          </div>

          {profileName && profileName !== `${submission.first_name} ${submission.last_name}` ? (
            <p className="text-xs text-muted-foreground">
              Account holder: {profileName} ({submission.profile_email})
            </p>
          ) : null}

          {/* Proof. An email-sourced submission has the stored message instead of a file. */}
          {submission.source === "email" ? (
            <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                From {submission.email_from ?? "unknown"}
              </p>
              <p className="text-sm font-medium">
                {submission.email_subject ?? "(no subject)"}
              </p>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">
                {submission.email_body ?? "(no body stored)"}
              </pre>
            </div>
          ) : null}

          {submission.proof_url ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Proof of payment</p>
              {isImage ? (
                // Plain <img>: this app has no images.remotePatterns, so an
                // optimized next/image against the Supabase host would fail.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={submission.proof_url}
                  alt="Proof of payment"
                  className="max-h-96 w-full rounded-lg border border-border object-contain"
                />
              ) : null}
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={submission.proof_url} target="_blank" rel="noreferrer">
                  <FileText className="size-4" />
                  {submission.proof_file_name ?? "Open proof"}
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            </div>
          ) : null}

          {submission.rejection_reason ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3">
              <p className="text-xs font-semibold text-destructive">Rejection reason</p>
              <p className="mt-1 text-sm">{submission.rejection_reason}</p>
            </div>
          ) : null}

          {submission.review_history.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Review history</p>
              <ul className="space-y-2">
                {submission.review_history.map((review) => (
                  <li key={review.id} className="rounded-lg border border-border p-2.5 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium capitalize">{review.decision}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      by {review.reviewer ?? "System"}
                    </p>
                    {review.reason ? <p className="mt-1 text-sm">{review.reason}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {isSelf ? (
            <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
              This is your own submission — another exec has to review it.
            </p>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onReject}
                disabled={isSubmitting}
              >
                <X className="size-4" />
                Reject
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={onApprove}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                Approve
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
