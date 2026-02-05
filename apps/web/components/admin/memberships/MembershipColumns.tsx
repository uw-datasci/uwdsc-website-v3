"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Pencil,
  Banknote,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MemberProfile } from "@/types/api";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@uwdsc/ui";

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

export type MembershipActionType = "edit" | "markPaid" | "delete";

export interface MembershipTableMeta {
  onAction: (type: MembershipActionType, member: MemberProfile) => void;
}

export const membershipColumns: ColumnDef<MemberProfile>[] = [
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
      return <div className="min-w-35">{name || "—"}</div>;
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
      const email = row.getValue("email") as string;
      return <div className="min-w-50 lowercase">{email}</div>;
    },
  },
  {
    accessorKey: "wat_iam",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        WatIAM
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const v = row.getValue("wat_iam") as string | null;
      return <span>{v ?? "—"}</span>;
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
      const v = row.getValue("user_role") as string | null;
      return <span className="capitalize">{v ?? "—"}</span>;
    },
  },
  {
    accessorKey: "has_paid",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Has Paid
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const v = row.getValue("has_paid") as boolean;
      const verifier = row.original.verifier;

      const content = (
        <span
          className={v ? "text-blue-400 font-medium" : "text-muted-foreground"}
        >
          {v ? "Yes" : "No"}
        </span>
      );

      // Only show tooltip if user has paid and there's a verifier
      if (v && verifier) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-block">{content}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Verified by: {verifier}</p>
            </TooltipContent>
          </Tooltip>
        );
      }

      return content;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const cellValue = row.getValue(columnId) as boolean;
      return filterValue === "true" ? cellValue === true : cellValue === false;
    },
  },
  {
    accessorKey: "is_math_soc_member",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        MathSoc
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const v = row.getValue("is_math_soc_member") as boolean;
      return (
        <span
          className={v ? "text-blue-400 font-medium" : "text-muted-foreground"}
        >
          {v ? "Yes" : "No"}
        </span>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const cellValue = row.getValue(columnId) as boolean;
      return filterValue === "true" ? cellValue === true : cellValue === false;
    },
  },
  {
    accessorKey: "faculty",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Faculty
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const v = row.getValue("faculty") as string | null;
      return <span>{v ?? "—"}</span>;
    },
  },
  {
    accessorKey: "term",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8"
      >
        Term
        <SortIcon direction={column.getIsSorted()} />
      </Button>
    ),
    cell: ({ row }) => {
      const v = row.getValue("term") as string | null;
      return <span>{v ?? "—"}</span>;
    },
  },
  {
    id: "actions",
    header: () => <span className="text-center w-full block">Actions</span>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as MembershipTableMeta | undefined;
      const member = row.original;
      if (!meta?.onAction) return null;
      return (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => meta.onAction("edit", member)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => meta.onAction("markPaid", member)}
            title="Mark as paid"
          >
            <Banknote className="h-4 w-4" />
            <span className="sr-only">Mark as paid</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => meta.onAction("delete", member)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      );
    },
  },
];
