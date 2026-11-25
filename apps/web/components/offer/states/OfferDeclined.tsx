import { MessageSquare } from "lucide-react";
import type { PublicOfferView } from "@uwdsc/common/types";
import { OfferMessage } from "../OfferMessage";
import { StateBadge } from "./shared";

export function OfferDeclined({ view }: { readonly view: PublicOfferView }) {
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
