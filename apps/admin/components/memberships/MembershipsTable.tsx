"use client";
"use no memo";

import { useEffect, useState, useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
} from "lucide-react";
import type { MemberProfile } from "@/types/api";
import type { MembershipFilterType } from "@/types/members";
import {
  membershipColumns,
  type MembershipActionType,
} from "./MembershipColumns";
import { DeleteMemberModal, EditMemberModal, MarkAsPaidModal } from "./modals";
import {
  Card,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@uwdsc/ui";
import { exportToCsv } from "@/lib/utils/csv";
import { globalMembershipFilter } from "@/lib/utils/table";

interface MembershipsTableProps {
  readonly profiles: MemberProfile[];
  readonly activeFilter: MembershipFilterType;
  readonly onRefresh?: () => void;
}

const MEMBERSHIP_CSV_HEADERS = [
  "name",
  "wat_iam",
  "user_role",
  "has_paid",
  "is_math_soc_member",
  "faculty",
] as const;

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "member", label: "Member" },
  { value: "exec", label: "Exec" },
  { value: "admin", label: "Admin" },
] as const;

const PAID_OPTIONS = [
  { value: "all", label: "All" },
  { value: "true", label: "Paid" },
  { value: "false", label: "Unpaid" },
] as const;

const MATH_SOC_OPTIONS = [
  { value: "all", label: "All" },
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
] as const;

const FACULTY_OPTIONS = [
  { value: "all", label: "All Faculties" },
  { value: "math", label: "Math" },
  { value: "engineering", label: "Engineering" },
  { value: "science", label: "Science" },
  { value: "arts", label: "Arts" },
  { value: "health", label: "Health" },
  { value: "environment", label: "Environment" },
  { value: "other_non_waterloo", label: "Other / Non-UW" },
] as const;

function getMembershipCsvValue(row: MemberProfile, key: string): unknown {
  if (key === "name") {
    const first = row.first_name ?? "";
    const last = row.last_name ?? "";
    return [first, last].filter(Boolean).join(" ");
  }
  return row[key as keyof MemberProfile];
}

export function MembershipsTable({
  profiles,
  activeFilter,
  onRefresh,
}: MembershipsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [actionModal, setActionModal] = useState<{
    type: MembershipActionType;
    member: MemberProfile;
  } | null>(null);

  // Sync column filters with activeFilter from stats cards
  useEffect(() => {
    setColumnFilters((prev) => {
      // Remove existing has_paid and is_math_soc_member filters
      const filtered = prev.filter(
        (f) => f.id !== "has_paid" && f.id !== "is_math_soc_member",
      );

      switch (activeFilter) {
        case "paid":
          return [...filtered, { id: "has_paid", value: "true" }];
        case "paid-mathsoc":
          return [
            ...filtered,
            { id: "has_paid", value: "true" },
            { id: "is_math_soc_member", value: "true" },
          ];
        case "all":
        default:
          return filtered;
      }
    });
  }, [activeFilter]);

  const table = useReactTable({
    data: profiles,
    columns: membershipColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalMembershipFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, globalFilter },
    initialState: { pagination: { pageSize: 20 } },
    meta: {
      onAction: (type: MembershipActionType, member: MemberProfile) => {
        setActionModal({ type, member });
      },
    },
  });

  const onExportCsv = useCallback(() => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCsv(
      data,
      { headers: [...MEMBERSHIP_CSV_HEADERS], getValue: getMembershipCsvValue },
      `memberships-${new Date().toISOString().split("T")[0]}`,
    );
  }, [table]);

  const renderActionModal = () => {
    if (!actionModal) return null;
    const { type, member } = actionModal;
    const onClose = () => setActionModal(null);
    switch (type) {
      case "edit":
        return (
          <EditMemberModal
            open
            onOpenChange={(open) => !open && onClose()}
            member={member}
            onSuccess={onRefresh}
          />
        );
      case "markPaid":
        return (
          <MarkAsPaidModal
            open
            onOpenChange={(open) => !open && onClose()}
            member={member}
            onSuccess={onRefresh}
          />
        );
      case "delete":
        return (
          <DeleteMemberModal
            open
            onOpenChange={(open) => !open && onClose()}
            member={member}
            onSuccess={onRefresh}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderActionModal()}

      <Card className="p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold">All Members</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {table.getFilteredRowModel().rows.length} total member
              {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              placeholder="Filter by name, email, or WatIAM..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="sm:w-96 h-9"
            />
            <Button onClick={onExportCsv} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Column Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Role
            </span>
            <Select
              value={
                (table.getColumn("user_role")?.getFilterValue() as string) ??
                "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("user_role")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-8 w-32.5">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Paid
            </span>
            <Select
              value={
                (table.getColumn("has_paid")?.getFilterValue() as string) ??
                "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("has_paid")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-8 w-25">
                <SelectValue placeholder="Paid" />
              </SelectTrigger>
              <SelectContent>
                {PAID_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              MathSoc
            </span>
            <Select
              value={
                (table
                  .getColumn("is_math_soc_member")
                  ?.getFilterValue() as string) ?? "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("is_math_soc_member")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-8 w-30">
                <SelectValue placeholder="MathSoc" />
              </SelectTrigger>
              <SelectContent>
                {MATH_SOC_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Faculty
            </span>
            <Select
              value={
                (table.getColumn("faculty")?.getFilterValue() as string) ??
                "all"
              }
              onValueChange={(value) =>
                table
                  .getColumn("faculty")
                  ?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-8 w-37.5">
                <SelectValue placeholder="Faculty" />
              </SelectTrigger>
              <SelectContent>
                {FACULTY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <div className="rounded-lg overflow-x-auto border">
            <Table className="min-w-160">
              <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={membershipColumns.length}
                    className="h-24 text-center"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 px-1">
          <p className="text-xs text-muted-foreground">
            Use the filter above to search. Click column headers to sort.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium whitespace-nowrap">
                Rows per page
              </span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-17.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium whitespace-nowrap">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount() || 1}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">First page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
