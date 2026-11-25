import { TimerOff } from "lucide-react";
import type { PublicOfferView } from "@uwdsc/common/types";
import { formatOfferDeadline } from "@uwdsc/common/utils";
import { OfferMessage } from "../OfferMessage";
import { StateBadge } from "./shared";

export function OfferExpired({ view }: { readonly view: PublicOfferView }) {
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
          Reply to the offer email. If the seat is still open, the presidents can send you a new
          offer.
        </div>
      </div>
    </OfferMessage>
  );
}
