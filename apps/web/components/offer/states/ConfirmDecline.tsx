import { MAX_RESPONSE_NOTE_LENGTH } from "@uwdsc/common/constants";
import type { PublicOfferView } from "@uwdsc/common/types";
import { Button, Label, Spinner, Textarea } from "@uwdsc/ui";
import { OfferShell } from "../OfferMessage";
import { BackButton, ErrorText, StepHeading } from "./shared";

/** Step 2 for Decline, with an optional note. Only "Decline offer" submits. */
export function ConfirmDecline({
  view,
  note,
  onNoteChange,
  submitting,
  error,
  onConfirm,
  onBack,
}: {
  readonly view: PublicOfferView;
  readonly note: string;
  readonly onNoteChange: (note: string) => void;
  readonly submitting: boolean;
  readonly error: string | null;
  readonly onConfirm: () => void;
  readonly onBack: () => void;
}) {
  return (
    <OfferShell>
      <div className="flex flex-col gap-5">
        <BackButton onClick={onBack} />
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
            onChange={(event) => onNoteChange(event.target.value)}
          />
        </div>
        <ErrorText error={error} />
        <div className="flex flex-col gap-2.5">
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-full border-foreground"
            disabled={submitting}
            onClick={onConfirm}
          >
            {submitting && <Spinner className="size-4" />}
            Decline offer
          </Button>
          <Button
            variant="ghost"
            className="h-11 self-center text-muted-foreground"
            disabled={submitting}
            onClick={onBack}
          >
            Keep the offer open
          </Button>
        </div>
      </div>
    </OfferShell>
  );
}
