"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Clock, Send } from "lucide-react";
import type { EmailPreview } from "@uwdsc/common/types";
import { formatOfferDeadline } from "@uwdsc/common/utils";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Spinner,
  Textarea,
} from "@uwdsc/ui";
import { useRecruiting } from "@/contexts/RecruitingContext";
import { useRefreshDecisions } from "@/hooks/useOfferActions";
import { previewOffer, previewResendOffer, resendOffer, sendOffer } from "@/lib/api";
import { EmailPreviewFrame } from "./EmailPreviewFrame";

/** The card being offered, or re-sent a new link. */
export interface OfferTarget {
  selectionId: string;
  name: string;
  email: string | null;
  positionName: string;
  subteamName: string | null;
  mode: "send" | "resend";
  personalLine: string | null;
}

interface SendOfferDialogProps {
  readonly target: OfferTarget | null;
  readonly onClose: () => void;
}

export function SendOfferDialog({ target, onClose }: SendOfferDialogProps) {
  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-2xl">
        {target && <SendOfferBody key={target.selectionId} target={target} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function SendOfferBody({ target, onClose }: { target: OfferTarget; onClose: () => void }) {
  const { capabilities } = useRecruiting();
  const refresh = useRefreshDecisions();
  const hours = capabilities?.cycle?.offerResponseHours ?? 48;
  const resend = target.mode === "resend";
  const [draft, setDraft] = useState(target.personalLine ?? "");
  const [personalLine, setPersonalLine] = useState(target.personalLine ?? "");
  const [sending, setSending] = useState(false);

  const { data, error, isLoading } = useSWR<EmailPreview, Error>(
    ["offer-preview", target.mode, target.selectionId, personalLine],
    () =>
      resend
        ? previewResendOffer(target.selectionId, { personalLine: personalLine || undefined })
        : previewOffer({
            selectionId: target.selectionId,
            personalLine: personalLine || undefined,
          }),
    { revalidateOnFocus: false, shouldRetryOnError: false, keepPreviousData: true }
  );

  const send = async () => {
    setSending(true);
    try {
      const line = draft.trim() || undefined;
      if (resend) await resendOffer(target.selectionId, { personalLine: line });
      else await sendOffer({ selectionId: target.selectionId, personalLine: line });
      toast.success(`${resend ? "New offer link" : "Offer"} sent to ${target.name}`);
      await refresh();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send the offer");
    } finally {
      setSending(false);
    }
  };

  const position = target.subteamName
    ? `${target.positionName} · ${target.subteamName}`
    : target.positionName;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {resend ? "Resend offer to" : "Send offer to"} {target.name}
        </DialogTitle>
        <DialogDescription>
          {resend
            ? `This sends a new link with a fresh ${hours}-hour deadline. The old link stops working.`
            : `Check the email below. The ${hours}-hour clock starts when you send.`}
        </DialogDescription>
      </DialogHeader>

      <dl className="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-3 gap-y-2 rounded-lg border px-3.5 py-3 text-[13px]">
        <dt className="text-muted-foreground">To</dt>
        <dd>{target.email ?? "No email on file"}</dd>
        <dt className="text-muted-foreground">Reply-To</dt>
        <dd className="truncate">{data?.replyTo.join(", ") || "Next term's presidents"}</dd>
        <dt className="text-muted-foreground">Position</dt>
        <dd className="font-medium">{position}</dd>
        <dt className="text-muted-foreground">Deadline</dt>
        <dd className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 text-xs leading-5 font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <Clock className="size-3" aria-hidden />
            {hours} hours
          </span>
          {formatOfferDeadline(new Date(Date.now() + hours * 3_600_000))} if sent now
        </dd>
      </dl>

      <EmailPreviewFrame
        html={data?.html ?? null}
        subject={data?.subject ?? null}
        loading={isLoading}
        error={error?.message ?? null}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="offer-line" className="text-[13px]">
          Personal line{" "}
          <span className="font-normal text-muted-foreground">
            (optional, added after the first sentence)
          </span>
        </Label>
        <Textarea
          id="offer-line"
          rows={2}
          maxLength={300}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => setPersonalLine(draft.trim())}
          className="resize-none text-[13px]"
        />
      </div>

      <DialogFooter className="items-center gap-2 border-t pt-4 sm:justify-between">
        <span className="text-xs text-muted-foreground">
          {resend
            ? `${target.name} stays at Offer Sent.`
            : `${target.name} moves to Offer Sent. Their VP sees the status but can't change it.`}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={sending} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={sending || !data || !target.email} onClick={() => void send()}>
            {sending ? <Spinner className="size-4" /> : <Send aria-hidden />}
            {resend ? "Resend offer" : "Send offer"}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
