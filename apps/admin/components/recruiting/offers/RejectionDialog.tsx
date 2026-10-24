"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { MailX } from "lucide-react";
import type { EmailPreview } from "@uwdsc/common/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@uwdsc/ui";
import { useRefreshDecisions } from "@/hooks/useOfferActions";
import { previewRejection, sendRejection } from "@/lib/api";
import { EmailPreviewFrame } from "./EmailPreviewFrame";

export interface RejectionTarget {
  applicationId: string;
  name: string;
}

/** Preview and send one candidate's rejection. */
export function RejectionDialog({
  target,
  onClose,
}: {
  readonly target: RejectionTarget | null;
  readonly onClose: () => void;
}) {
  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        {target && (
          <RejectionBody key={target.applicationId} target={target} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function RejectionBody({ target, onClose }: { target: RejectionTarget; onClose: () => void }) {
  const refresh = useRefreshDecisions();
  const [sending, setSending] = useState(false);
  const { data, error, isLoading } = useSWR<EmailPreview, Error>(
    ["rejection-preview", target.applicationId],
    () => previewRejection(target.applicationId),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const send = async () => {
    setSending(true);
    try {
      await sendRejection(target.applicationId);
      toast.success(`Rejection sent to ${target.name}`);
      await refresh();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send the rejection");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Send rejection to {target.name}</DialogTitle>
        <DialogDescription>
          {data ? `To ${data.to}.` : "Check the email below."} Their open positions move to
          Rejection Sent.
        </DialogDescription>
      </DialogHeader>
      <EmailPreviewFrame
        html={data?.html ?? null}
        subject={data?.subject ?? null}
        loading={isLoading}
        error={error?.message ?? null}
      />
      <DialogFooter className="items-center gap-2 border-t pt-4 sm:justify-between">
        <span className="text-xs text-muted-foreground">Emails can&apos;t be unsent.</span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={sending} onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={sending || !data} onClick={() => void send()}>
            {sending ? <Spinner className="size-4" /> : <MailX aria-hidden />}
            Send rejection
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
