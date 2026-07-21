"use client";

import { Badge, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@uwdsc/ui";
import type { SupportTicket } from "@uwdsc/common/types";
import { formatTicketDate, SourceBadge } from "./utils";

interface TicketDetailSheetProps {
  readonly ticket: SupportTicket | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function TicketDetailSheet({ ticket, open, onOpenChange }: TicketDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto px-6 pb-6 pt-6 sm:max-w-xl">
        <SheetHeader className="p-0">
          <SheetTitle>{ticket?.subject ?? "Ticket detail"}</SheetTitle>
          <SheetDescription>
            {ticket ? `${ticket.name} · ${ticket.email}` : "Support ticket"}
          </SheetDescription>
        </SheetHeader>

        {ticket && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source={ticket.source} />
              <Badge variant="outline">{formatTicketDate(ticket.createdAt)}</Badge>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-medium">Message</h3>
              <p className="rounded-md border bg-muted/40 p-3 text-sm break-words whitespace-pre-wrap">
                {ticket.message}
              </p>
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
