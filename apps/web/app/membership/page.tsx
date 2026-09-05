"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button, Card, CardDescription, CardHeader, CardTitle, Spinner } from "@uwdsc/ui";
import { MEMBERSHIP_INBOUND_EMAIL, MEMBERSHIP_PAYMENT_URL } from "@uwdsc/common/constants";
import type { MembershipSubmissionView } from "@uwdsc/common/types";
import {
  MembershipSubmissionForm,
  RejectionBanner,
  SubmissionStatusCard,
} from "@/components/membership";
import { useAuth } from "@/contexts/AuthContext";
import { getMembershipSubmission } from "@/lib/api";

export default function MembershipPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [view, setView] = useState<MembershipSubmissionView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getMembershipSubmission()
      .then(setView)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setIsLoading(false));
  }, []);

  if (authLoading || isLoading) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  const submission = view?.submission ?? null;
  const isVerified = view?.has_membership || submission?.status === "approved";
  const noActiveTerm = view != null && view.term_code === null;

  let body: React.ReactNode;

  if (loadError) {
    body = (
      <Card>
        <CardHeader>
          <CardTitle>Couldn&apos;t load your submission</CardTitle>
          <CardDescription>{loadError}</CardDescription>
        </CardHeader>
      </Card>
    );
  } else if (noActiveTerm) {
    body = (
      <Card>
        <CardHeader>
          <CardTitle>No active term</CardTitle>
          <CardDescription>
            Memberships aren&apos;t open right now. Check back at the start of next term.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  } else if (isVerified) {
    body = submission ? (
      <SubmissionStatusCard
        submission={submission}
        proofUrl={view?.proof_url ?? null}
        proofFileName={view?.proof_file_name ?? null}
        isVerified
      />
    ) : (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <CardTitle>You&apos;re a verified member</CardTitle>
          </div>
          <CardDescription>
            Your membership for {view?.term_code} is already active. Nothing to submit.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  } else if (submission?.status === "pending") {
    body = (
      <SubmissionStatusCard
        submission={submission}
        proofUrl={view?.proof_url ?? null}
        proofFileName={view?.proof_file_name ?? null}
        isVerified={false}
      />
    );
  } else {
    body = (
      <>
        {submission?.status === "rejected" && submission.rejection_reason ? (
          <RejectionBanner reason={submission.rejection_reason} />
        ) : null}
        <MembershipSubmissionForm
          isResubmission={submission?.status === "rejected"}
          defaults={{
            first_name: submission?.first_name ?? user?.first_name ?? "",
            last_name: submission?.last_name ?? user?.last_name ?? "",
            wat_iam: submission?.wat_iam ?? user?.wat_iam ?? "",
            contact_email: submission?.contact_email ?? user?.email ?? "",
          }}
          onSubmitted={setView}
        />
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Haven&apos;t paid yet?{" "}
          <a
            href={MEMBERSHIP_PAYMENT_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-primary"
          >
            Buy a membership on the WUSA shop
          </a>
          , or forward your Moneris receipt to {MEMBERSHIP_INBOUND_EMAIL} to be verified
          automatically.
        </p>
      </>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 pb-16 pt-28 lg:pt-32">
      <div className="w-full max-w-2xl space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 self-start">
          <Link href="/passport">
            <ArrowLeft className="size-4" />
            Back to passport
          </Link>
        </Button>
        {body}
      </div>
    </main>
  );
}
