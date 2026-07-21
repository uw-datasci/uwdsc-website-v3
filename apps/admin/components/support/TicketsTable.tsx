"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uwdsc/ui";
import type { SupportTicket } from "@uwdsc/common/types";
import { formatTicketDate, SourceBadge, truncateText } from "./utils";
import { TicketDetailSheet } from "./TicketDetailSheet";

interface TicketsTableProps {
  readonly tickets: SupportTicket[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly onPageChange: (page: number) => void;
}

export function TicketsTable({ tickets, total, page, pageSize, onPageChange }: TicketsTableProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Contact form submissions and support emails</CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No tickets match the current filters.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <TableCell className="font-medium">{ticket.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{ticket.email}</TableCell>
                      <TableCell className="max-w-[260px]">
                        {truncateText(ticket.subject, 60)}
                      </TableCell>
                      <TableCell>
                        <SourceBadge source={ticket.source} />
                      </TableCell>
                      <TableCell>{formatTicketDate(ticket.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} tickets)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TicketDetailSheet
        ticket={selectedTicket}
        open={selectedTicket !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTicket(null);
        }}
      />
    </>
  );
}
