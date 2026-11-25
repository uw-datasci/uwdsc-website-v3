"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import type { EmailPreview } from "@uwdsc/common/types";
import { firstName } from "@uwdsc/common/utils";
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
  Switch,
} from "@uwdsc/ui";
import { useRefreshDecisions } from "@/hooks/useOfferActions";
import { previewWithdrawOffer, withdrawOffer } from "@/lib/api";
import { EmailPreviewFrame } from "./EmailPreviewFrame";

export interface WithdrawTarget {
  selectionId: string;
  name: string;
  email: string | null;
  positionName: string;
}

/** Close an open offer, with an optional "offer withdrawn" email. */
export function WithdrawOfferDialog({
  target,
  onClose,
}: {
  readonly target: WithdrawTarget | null;
  readonly onClose: () => void;
}) {
  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-2xl">
        {target && <WithdrawBody key={target.selectionId} target={target} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function WithdrawBody({ target, onClose }: { target: WithdrawTarget; onClose: () => void }) {
  const refresh = useRefreshDecisions();
  const [notify, setNotify] = useState(!!target.email);
  const [sending, setSending] = useState(false);
  const { data, error, isLoading } = useSWR<EmailPreview, Error>(
    notify ? ["withdraw-preview", target.selectionId] : null,
    () => previewWithdrawOffer(target.selectionId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const submit = async () => {
    setSending(true);
    try {
      await withdrawOffer(target.selectionId, { notify });
      toast.success(`Offer to ${target.name} withdrawn`);
      await refresh();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't withdraw the offer");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Withdraw the {target.positionName} offer?</DialogTitle>
        <DialogDescription>
          {target.name} moves to Declined Offer, their link stops working and the seat opens up.
          You can&apos;t undo this from Recruiting.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-3 rounded-lg border px-3.5 py-3">
        <Switch
          id="withdraw-notify"
          checked={notify}
          disabled={!target.email}
          onCheckedChange={setNotify}
        />
        <Label htmlFor="withdraw-notify" className="flex flex-col items-start gap-0.5">
          <span className="text-[13px]">Let {firstName(target.name)} know by email</span>
          <span className="text-xs font-normal text-muted-foreground">
            {target.email
              ? `To ${target.email}. Turn off if the offer went out by mistake and you'll reach out yourself.`
              : "No email on file."}
          </span>
        </Label>
      </div>

      {notify && (
        <EmailPreviewFrame
          html={data?.html ?? null}
          subject={data?.subject ?? null}
          loading={isLoading}
          error={error?.message ?? null}
        />
      )}

      <DialogFooter className="items-center gap-2 border-t pt-4 sm:justify-end">
        <Button variant="outline" disabled={sending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={sending || (notify && !data)}
          onClick={() => void submit()}
        >
          {sending ? <Spinner className="size-4" /> : <Undo2 aria-hidden />}
          Withdraw offer
        </Button>
      </DialogFooter>
    </>
  );
}
