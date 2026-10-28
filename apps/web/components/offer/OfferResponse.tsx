"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, CircleSlash, Clock, MessageSquare, TimerOff } from "lucide-react";
import { MAX_RESPONSE_NOTE_LENGTH } from "@uwdsc/common/constants";
import type { PublicOfferView } from "@uwdsc/common/types";
import { formatOfferDeadline } from "@uwdsc/common/utils";
import { Button, Label, Spinner, Textarea } from "@uwdsc/ui";
import { respondToOffer } from "@/lib/api";
import { OfferMessage, OfferShell } from "./OfferMessage";

export type OfferStep = "offer" | "confirmAccept" | "confirmDecline";

interface OfferResponseProps {
  readonly token: string;
  readonly initialView: PublicOfferView;
  readonly initialStep: OfferStep;
  readonly hoursLeft: number;
}

export function OfferResponse({
  token,
  initialView,
  initialStep,
  hoursLeft,
}: OfferResponseProps) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [step, setStep] = useState<OfferStep>(initialStep);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (response: "accepted" | "declined") => {
    setSubmitting(true);
    setError(null);
    try {
      const next = await respondToOffer(token, {
        response,
        note: response === "declined" && note.trim() ? note.trim() : undefined,
      });
      setView(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      const status = (err as { status?: number }).status;
      if (status === 409 || status === 410) router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const role = view.subteamName
    ? `${view.positionName} · ${view.subteamName}`
    : view.positionName;
  const summary = (
    <div className="w-full rounded-xl border bg-card px-4 py-3.5 text-left text-sm">
      <div className="font-semibold">{role}</div>
      <div className="text-muted-foreground">{view.termLabel}</div>
    </div>
  );

  if (view.state === "accepted") {
    return (
      <OfferMessage
        tone="success"
        icon={<Check className="size-7" />}
        badge={
          <StateBadge className="bg-emerald-500/15 text-emerald-400">
            Accepted
            {view.respondedAt ? ` · ${formatOfferDeadline(view.respondedAt)}` : ""}
          </StateBadge>
        }
        title="You're on the team"
        body={`Welcome to ${view.subteamName ?? "DSC"}. The presidents will send next steps once the team is finalized.`}
      >
        {summary}
        <p className="mt-2 text-[13px] leading-normal text-muted-foreground">
          You&apos;ve already responded, so this link won&apos;t change anything. Need to change
          your answer? Reply to the offer email.
        </p>
      </OfferMessage>
    );
  }

  if (view.state === "declined") {
    return (
      <OfferMessage
        icon={<MessageSquare className="size-7" />}
        badge={<StateBadge className="bg-muted">Declined</StateBadge>}
        title={
          view.acceptedElsewhere ? "You accepted another offer" : "Thanks for letting us know"
        }
        body={
          view.acceptedElsewhere
            ? `You accepted the ${view.acceptedElsewhere} offer, so this one closed.`
            : "We hope to see you at events, and you're welcome to apply again next term."
        }
      />
    );
  }

  if (view.state === "expired") {
    return (
      <OfferMessage
        tone="error"
        icon={<TimerOff className="size-7" />}
        badge={<StateBadge className="bg-red-500/15 text-red-300">Expired</StateBadge>}
        title="This offer has expired"
        body={`The deadline for the ${view.positionName} offer was ${formatOfferDeadline(view.expiresAt)}, so the seat may have gone to someone else.`}
      >
        <div className="mt-2 w-full rounded-xl border bg-card px-4 py-3.5 text-left text-sm">
          <div className="font-semibold">Still interested?</div>
          <div className="text-muted-foreground">
            Reply to the offer email. If the seat is still open, the presidents can send you a
            new offer.
          </div>
        </div>
      </OfferMessage>
    );
  }

  if (view.state === "closed") {
    return (
      <OfferMessage
        icon={<CircleSlash className="size-7" />}
        title="This offer is no longer open"
        body="If you have questions, reply to the offer email and the presidents will get back to you."
      />
    );
  }

  const errorText = error && (
    <p role="alert" className="text-sm text-destructive">
      {error}
    </p>
  );

  if (step === "confirmAccept") {
    return (
      <OfferShell>
        <div className="flex flex-col gap-5">
          <BackButton onClick={() => setStep("offer")} />
          <StepHeading title={`Accept the ${view.positionName} offer?`} />
          <p className="text-[15px] leading-relaxed">
            You&apos;ll join {view.subteamName ?? "DSC"} for {view.termLabel}. The presidents
            will send next steps once the team is finalized.
          </p>
          {summary}
          {errorText}
          <div className="flex flex-col gap-2.5">
            <Button
              size="lg"
              className="h-12 w-full"
              disabled={submitting}
              onClick={() => void submit("accepted")}
            >
              {submitting ? <Spinner className="size-4" /> : <Check aria-hidden />}
              Yes, accept offer
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full"
              disabled={submitting}
              onClick={() => setStep("offer")}
            >
              Not yet
            </Button>
          </div>
        </div>
      </OfferShell>
    );
  }

  if (step === "confirmDecline") {
    return (
      <OfferShell>
        <div className="flex flex-col gap-5">
          <BackButton onClick={() => setStep("offer")} />
          <StepHeading title="Decline this offer?" />
          <p className="text-[15px] leading-relaxed">
            The {view.positionName} seat will go to another candidate. You&apos;re welcome to
            apply again next term.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="offer-decline-note">
              Anything you&apos;d like us to know?{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="offer-decline-note"
              rows={3}
              maxLength={MAX_RESPONSE_NOTE_LENGTH}
              placeholder="For example, a co-op term or a heavy course load"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
          {errorText}
          <div className="flex flex-col gap-2.5">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full border-foreground"
              disabled={submitting}
              onClick={() => void submit("declined")}
            >
              {submitting && <Spinner className="size-4" />}
              Decline offer
            </Button>
            <Button
              variant="ghost"
              className="h-11 self-center text-muted-foreground"
              disabled={submitting}
              onClick={() => setStep("offer")}
            >
              Keep the offer open
            </Button>
          </div>
        </div>
      </OfferShell>
    );
  }

  return (
    <OfferShell>
      <div className="flex flex-col gap-5">
        <div>
          <div className="text-[13px] font-semibold text-muted-foreground">
            Exec offer · {view.termLabel}
          </div>
          <h1 className="mt-1.5 text-[26px] leading-8 font-semibold tracking-tight">
            {view.firstName}, we&apos;d like you on the team
          </h1>
        </div>

        <dl className="rounded-xl border bg-card px-4 py-1 text-[15px]">
          <DetailRow label="Role" value={view.positionName} strong />
          {view.subteamName && <DetailRow label="Subteam" value={view.subteamName} />}
          <DetailRow label="Term" value={view.termLabel} last />
        </dl>

        <div className="flex items-start gap-3 rounded-xl bg-amber-500/15 px-4 py-3.5 text-amber-200">
          <Clock className="mt-0.5 size-5 flex-none" aria-hidden />
          <div>
            <div className="font-semibold">
              Respond by {formatOfferDeadline(view.expiresAt)}
            </div>
            <div className="text-sm">
              {hoursLeft >= 1
                ? `${hoursLeft} hour${hoursLeft === 1 ? "" : "s"} left. After that, the offer expires.`
                : "Less than an hour left. After that, the offer expires."}
            </div>
          </div>
        </div>

        {view.personalLine && (
          <p className="text-[15px] leading-relaxed">{view.personalLine}</p>
        )}
        <p className="-mt-2 text-sm text-muted-foreground">{view.signedBy}, Presidents</p>

        <div className="mt-1 flex flex-col gap-2.5">
          <Button size="lg" className="h-12 w-full" onClick={() => setStep("confirmAccept")}>
            Accept offer
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full"
            onClick={() => setStep("confirmDecline")}
          >
            Decline
          </Button>
        </div>
        <p className="text-center text-[13px] leading-normal text-muted-foreground">
          Questions? Reply to the offer email and the presidents will get back to you.
        </p>
      </div>
    </OfferShell>
  );
}

function StateBadge({
  className,
  children,
}: {
  readonly className: string;
  readonly children: ReactNode;
}) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

function BackButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      className="-my-2 -ml-3 h-11 self-start text-muted-foreground"
      onClick={onClick}
    >
      <ChevronLeft aria-hidden />
      Back to offer
    </Button>
  );
}

function StepHeading({ title }: { readonly title: string }) {
  return (
    <div>
      <div className="text-[13px] font-semibold text-muted-foreground">
        Step 2 of 2 · Confirm
      </div>
      <h1 className="mt-1.5 text-[26px] leading-8 font-semibold tracking-tight">{title}</h1>
    </div>
  );
}

function DetailRow({
  label,
  value,
  strong,
  last,
}: {
  readonly label: string;
  readonly value: string;
  readonly strong?: boolean;
  readonly last?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-3 py-3 ${last ? "" : "border-b"}`}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right ${strong ? "font-semibold" : ""}`}>{value}</dd>
    </div>
  );
}
