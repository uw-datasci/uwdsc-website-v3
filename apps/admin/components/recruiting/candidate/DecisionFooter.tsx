"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, MailX, Send } from "lucide-react";
import { individualRejection } from "@uwdsc/common/recruiting";
import type { BoardCard } from "@uwdsc/common/types";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uwdsc/ui";
import { useOfferResponse } from "@/hooks/useOfferActions";
import {
  RejectionDialog,
  SendOfferDialog,
  type OfferTarget,
  type RejectionTarget,
} from "../offers";

/** President actions in the drawer: send an offer or rejection, record a reply. */
export function DecisionFooter({ cards }: { readonly cards: readonly BoardCard[] }) {
  const respond = useOfferResponse();
  const [offerTarget, setOfferTarget] = useState<OfferTarget | null>(null);
  const [rejectionTarget, setRejectionTarget] = useState<RejectionTarget | null>(null);

  const wanted = cards.filter((card) => card.status === "Wanted");
  const sent = cards.filter((card) => card.status === "Offer Sent");
  const rejection = individualRejection(
    cards.map((card) => ({
      selectionId: card.id,
      applicationId: card.applicationId,
      name: card.name,
      positionId: card.positionId,
      positionName: card.positionName,
      status: card.status,
    }))
  );
  const first = cards[0];

  const target = (card: BoardCard): OfferTarget => ({
    selectionId: card.id,
    name: card.name,
    email: card.email,
    positionName: card.positionName,
    subteamName: card.subteamName,
  });

  return (
    <footer className="flex flex-wrap items-center gap-2 border-t px-5 py-3">
      <span className="mr-auto text-xs text-muted-foreground">
        Emails are previewed before they send.
      </span>

      {sent.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Record reply
              <ChevronDown aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sent.map((card, index) => (
              <div key={card.id}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="text-xs">{card.positionName}</DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={() =>
                    void respond({ selectionId: card.id, name: card.name }, "accepted")
                  }
                >
                  Mark accepted
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    void respond({ selectionId: card.id, name: card.name }, "declined")
                  }
                >
                  Mark declined
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <WithReason reason={rejection.ok ? null : rejection.reason}>
        <Button
          variant="outline"
          size="sm"
          disabled={!rejection.ok || !first}
          onClick={() =>
            first &&
            setRejectionTarget({ applicationId: first.applicationId, name: first.name })
          }
        >
          <MailX aria-hidden />
          Send rejection
        </Button>
      </WithReason>

      {wanted.length > 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Send aria-hidden />
              Send offer
              <ChevronDown aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {wanted.map((card) => (
              <DropdownMenuItem key={card.id} onSelect={() => setOfferTarget(target(card))}>
                {card.positionName}
                {card.subteamName ? ` · ${card.subteamName}` : ""}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <WithReason reason={wanted.length === 0 ? "No position is Wanted yet." : null}>
          <Button
            size="sm"
            disabled={wanted.length === 0}
            onClick={() => wanted[0] && setOfferTarget(target(wanted[0]))}
          >
            <Send aria-hidden />
            Send offer
          </Button>
        </WithReason>
      )}

      <SendOfferDialog target={offerTarget} onClose={() => setOfferTarget(null)} />
      <RejectionDialog target={rejectionTarget} onClose={() => setRejectionTarget(null)} />
    </footer>
  );
}

function WithReason({
  reason,
  children,
}: {
  readonly reason: string | null;
  readonly children: ReactNode;
}) {
  if (!reason) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );
}
