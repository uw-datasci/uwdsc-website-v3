import { Check } from "lucide-react";
import type { PublicOfferView } from "@uwdsc/common/types";
import { formatOfferDeadline } from "@uwdsc/common/utils";
import { OfferMessage } from "../OfferMessage";
import { OfferSummary, StateBadge } from "./shared";

export function OfferAccepted({ view }: { readonly view: PublicOfferView }) {
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
      body={`Welcome to ${view.subteamName ?? "DSC"}. We will send next steps once the team is finalized.`}
    >
      <OfferSummary view={view} />
      <p className="mt-2 text-[13px] leading-normal text-muted-foreground">
        You&apos;ve already responded, so this link won&apos;t change anything. Need to change
        your answer? Reply to the offer email.
      </p>
    </OfferMessage>
  );
}
