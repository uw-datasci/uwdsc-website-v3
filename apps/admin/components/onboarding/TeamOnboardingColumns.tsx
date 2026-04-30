"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Eye, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge, Button } from "@uwdsc/ui";
import type { OnboardingAdminRow } from "@uwdsc/common/types";

const SORT_ICONS = {
  asc: ArrowUp,
  desc: ArrowDown,
  false: Minus,
} as const;

const SORT_LABELS: Record<"asc" | "desc" | "false", string> = {
  asc: "ascending",
  desc: "descending",
  false: "unsorted",
};

function SortIcon({
  direction,
}: Readonly<{ direction: false | "asc" | "desc" }>) {
  const key = direction === false ? "false" : direction;
  const Icon = SORT_ICONS[key];

  return (
    <span
      className="ml-2 inline-flex h-4 w-4 shrink-0 items-center justify-center"
      aria-hidden
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center justify-center"
          aria-label={SORT_LABELS[key]}
        >
          <Icon className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export type OnboardingActionType = "view";

export interface OnboardingTableMeta {
  onAction: (type: OnboardingActionType, row: OnboardingAdminRow) => void;
}

function getDisplayRole(row: OnboardingAdminRow): string {
  return row.submission_role_name || row.exec_position_name || row.user_role;
}

export const onboardingColumns: ColumnDef<OnboardingAdminRow>[] = [
  {
    id: "name",
    accessorFn: (row) =>
      [row.first_name, row.last_name].filter(Boolean).join(" ") || "—",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Name
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const first = row.original.first_name ?? "";
      const last = row.original.last_name ?? "";
      const name = [first, last].filter(Boolean).join(" ");
      return <div className="min-w-36 px-1">{name || "—"}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Email
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;
      return <span className="truncate max-w-56 block">{email ?? "—"}</span>;
    },
  },
  {
    accessorKey: "user_role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Role
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.getValue("user_role") as string;
      return <span className="truncate max-w-40 block">{role}</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const value = row.getValue(columnId) as string;
      return value === filterValue;
    },
  },
  {
    id: "position",
    accessorFn: (row) => getDisplayRole(row),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Position
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="truncate max-w-40 block">
        {getDisplayRole(row.original)}
      </span>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const value = row.getValue(columnId) as string;
      return value === filterValue;
    },
  },
  {
    id: "term_type",
    accessorFn: (row) => row.submission?.term_type ?? null,
    header: "Term Type",
    cell: ({ row }) => {
      const termType = row.getValue("term_type") as string | null;
      return <span className="capitalize">{termType ?? "—"}</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const value = row.getValue(columnId) as string | null;
      return value === filterValue;
    },
  },
  {
    id: "status",
    accessorFn: (row) => (row.submission ? "submitted" : "missing"),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Status
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "submitted" ? "default" : "outline"}
          className={`${status === "submitted" ? "bg-green-500/15 border-green-500 text-foreground" : ""}`}
        >
          {status === "submitted" ? "Submitted" : "Not submitted"}
        </Badge>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      const value = row.getValue(columnId) as string;
      return value === filterValue;
    },
  },
  {
    id: "submitted_at",
    accessorFn: (row) => row.submission?.submitted_at ?? null,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Submitted
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const submittedAt = row.getValue("submitted_at") as string | null;
      if (!submittedAt) return <span>—</span>;
      const date = new Date(submittedAt);
      if (Number.isNaN(date.getTime())) return <span>—</span>;
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    header: () => <span className="text-center w-full block">Actions</span>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as OnboardingTableMeta | undefined;
      if (!meta?.onAction) return null;
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => meta.onAction("view", row.original)}
            title="View answers"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View answers</span>
          </Button>
        </div>
      );
    },
  },
];
