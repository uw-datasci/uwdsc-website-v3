import { CircleSlash } from "lucide-react";
import { OfferMessage } from "../OfferMessage";

export function OfferClosed() {
  return (
    <OfferMessage
      icon={<CircleSlash className="size-7" />}
      title="This offer is no longer open"
      body="If you have questions, reply to the offer email and we will get back to you."
    />
  );
}
