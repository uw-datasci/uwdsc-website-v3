import { Check } from "lucide-react";
import type { PublicOfferView } from "@uwdsc/common/types";
import { Button, Spinner } from "@uwdsc/ui";
import { OfferShell } from "../OfferMessage";
import { BackButton, ErrorText, OfferSummary, StepHeading } from "./shared";

/** Step 2 for Accept. Only "Yes, accept offer" submits. */
export function ConfirmAccept({
  view,
  submitting,
  error,
  onConfirm,
  onBack,
}: {
  readonly view: PublicOfferView;
  readonly submitting: boolean;
  readonly error: string | null;
  readonly onConfirm: () => void;
  readonly onBack: () => void;
}) {
  return (
    <OfferShell>
      <div className="flex flex-col gap-5">
        <BackButton onClick={onBack} />
        <StepHeading title={`Accept the ${view.positionName} offer?`} />
        <p className="text-[15px] leading-relaxed">
          You&apos;ll join {view.subteamName ?? "DSC"} for {view.termLabel}. The presidents will
          send next steps once the team is finalized.
        </p>
        <OfferSummary view={view} />
        <ErrorText error={error} />
        <div className="flex flex-col gap-2.5">
          <Button size="lg" className="h-12 w-full" disabled={submitting} onClick={onConfirm}>
            {submitting ? <Spinner className="size-4" /> : <Check aria-hidden />}
            Yes, accept offer
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full"
            disabled={submitting}
            onClick={onBack}
          >
            Not yet
          </Button>
        </div>
      </div>
    </OfferShell>
  );
}
