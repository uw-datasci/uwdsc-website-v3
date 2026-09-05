import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@uwdsc/ui";
import type { MembershipSubmission } from "@uwdsc/common/types";

interface SubmissionStatusCardProps {
  readonly submission: MembershipSubmission;
  readonly proofUrl: string | null;
  readonly proofFileName: string | null;
  /**
   * The member holds a membership for this term. Not the same as an approved
   * submission -- they may have paid in person after submitting proof online.
   */
  readonly isVerified: boolean;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SubmissionStatusCard({
  submission,
  proofUrl,
  proofFileName,
  isVerified,
}: SubmissionStatusCardProps) {
  const isApproved = isVerified || submission.status === "approved";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>{isApproved ? "Membership verified" : "Submission received"}</CardTitle>
            <CardDescription>
              {isApproved
                ? `Verified for ${submission.term_code}. You're all set.`
                : "An exec will review your proof of payment shortly."}
            </CardDescription>
          </div>
          {isApproved ? (
            <Badge className="shrink-0 gap-1 rounded-full bg-emerald-500/15 text-emerald-500">
              <CheckCircle2 className="size-3.5" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0 gap-1 rounded-full">
              <Clock className="size-3.5" />
              Pending review
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">
              {submission.first_name} {submission.last_name}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">WatIAM</dt>
            <dd className="font-medium">{submission.wat_iam}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="truncate font-medium">{submission.contact_email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Program</dt>
            <dd className="font-medium">{submission.program || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Term type</dt>
            <dd className="font-medium">
              {submission.is_coop_term === null
                ? "—"
                : submission.is_coop_term
                  ? "Co-op work term"
                  : "Study term"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Submitted</dt>
            <dd className="font-medium">{formatDate(submission.submitted_at)}</dd>
          </div>
        </dl>

        {proofFileName ? (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            {proofUrl ? (
              <a
                href={proofUrl}
                target="_blank"
                rel="noreferrer"
                className="truncate underline underline-offset-4"
              >
                {proofFileName}
              </a>
            ) : (
              <span className="truncate">{proofFileName}</span>
            )}
          </div>
        ) : null}

        {submission.source === "email" ? (
          <p className="text-xs text-muted-foreground">
            This submission came from the receipt you forwarded by email.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

interface RejectionBannerProps {
  readonly reason: string;
}

export function RejectionBanner({ reason }: RejectionBannerProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-destructive">
          Your submission was not approved
        </p>
        <p className="text-sm text-muted-foreground">{reason}</p>
        <p className="text-sm text-muted-foreground">Fix the issue above and submit again.</p>
      </div>
    </div>
  );
}
