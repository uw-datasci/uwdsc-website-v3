"use client";
"use no memo";

import { useMemo, useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import {
  Badge,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@uwdsc/ui";
import type { ContactSubmissionItem } from "@uwdsc/common/types";
import { SupportDetailSheet } from "./SupportDetailSheet";

interface SupportTableProps {
  readonly submissions: ContactSubmissionItem[];
  readonly onRefresh: () => void;
}

const SOURCE_OPTIONS = [
  { value: "all", label: "All sources" },
  { value: "contact_form", label: "Contact form" },
  { value: "email", label: "Email" },
] as const;

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
  { value: "all", label: "All" },
] as const;

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SupportTable({ submissions, onRefresh }: SupportTableProps) {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [selected, setSelected] = useState<ContactSubmissionItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      if (sourceFilter !== "all" && submission.source !== sourceFilter) return false;

      const isResolved = submission.resolved_at !== null;
      if (statusFilter === "open" && isResolved) return false;
      if (statusFilter === "resolved" && !isResolved) return false;

      if (!query) return true;

      return [submission.name, submission.email, submission.subject]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [submissions, sourceFilter, statusFilter, search]);

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email or subject…"
          className="sm:max-w-xs"
        />
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {filtered.length} message{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Received</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No messages.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <div className="font-medium">{submission.name}</div>
                  <div className="text-xs text-muted-foreground">{submission.email}</div>
                </TableCell>
                <TableCell className="max-w-64 truncate">{submission.subject}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    {submission.source === "email" ? (
                      <Mail className="size-3.5" />
                    ) : (
                      <MessageSquare className="size-3.5" />
                    )}
                    {submission.source === "email" ? "Email" : "Form"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={submission.resolved_at ? "secondary" : "outline"}>
                    {submission.resolved_at ? "Resolved" : "Open"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(submission.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(submission);
                      setSheetOpen(true);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <SupportDetailSheet
        submission={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onRefresh={onRefresh}
      />
    </Card>
  );
}
