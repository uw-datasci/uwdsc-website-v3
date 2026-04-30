"use client";

import { useCallback, useMemo, useState } from "react";
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
  Image,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@uwdsc/ui";
import { exportToCsv } from "@/lib/utils/csv";
import { globalOnboardingFilter } from "@/lib/utils/table";
import type { OnboardingAdminRow } from "@uwdsc/common/types";
import { downloadTeamHeadshots } from "@/lib/api/onboarding";
import {
  onboardingColumns,
  type OnboardingActionType,
} from "./TeamOnboardingColumns";

interface TeamOnboardingTableProps {
  readonly rows: OnboardingAdminRow[];
  readonly termId: string | null;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "missing", label: "Not submitted" },
] as const;

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "exec", label: "Exec" },
] as const;

const TERM_TYPE_OPTIONS = [
  { value: "all", label: "All Term Types" },
  { value: "study", label: "Study" },
  { value: "coop", label: "Co-op" },
] as const;

const ONBOARDING_CSV_HEADERS = [
  "name",
  "email",
  "user_role",
  "position",
  "submitted",
  "term_type",
  "in_waterloo",
  "discord",
  "datasci_competency",
  "instagram",
  "additional_comments",
] as const;

function getCsvValue(row: OnboardingAdminRow, key: string): unknown {
  if (key === "name") {
    return [row.first_name, row.last_name].filter(Boolean).join(" ");
  }
  if (key === "position") {
    return row.submission_role_name || row.exec_position_name || row.user_role;
  }
  if (key === "submitted") {
    return row.submission ? "yes" : "no";
  }

  const submission = row.submission;
  switch (key) {
    case "term_type":
      return submission?.term_type ?? "";
    case "in_waterloo":
      return submission?.in_waterloo ?? "";
    case "discord":
      return submission?.discord ?? "";
    case "datasci_competency":
      return submission?.datasci_competency ?? "";
    case "instagram":
      return submission?.instagram ?? "";
    case "additional_comments":
      return submission?.anything_else ?? "";
    default:
      return (row as unknown as Record<string, unknown>)[key];
  }
}

export function TeamOnboardingTable({
  rows,
  termId,
}: TeamOnboardingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [activeRow, setActiveRow] = useState<OnboardingAdminRow | null>(null);
  const [isExportingHeadshots, setIsExportingHeadshots] = useState(false);

  const positionOptions = useMemo(() => {
    const unique = new Set<string>();
    rows.forEach((row) => {
      const label =
        row.submission_role_name || row.exec_position_name || row.user_role;
      if (label) unique.add(label);
    });
    return [{ value: "all", label: "All Positions" }].concat(
      [...unique]
        .sort((a, b) => a.localeCompare(b))
        .map((label) => ({ value: label, label })),
    );
  }, [rows]);

  const table = useReactTable({
    data: rows,
    columns: onboardingColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalOnboardingFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, globalFilter },
    initialState: { pagination: { pageSize: 20 } },
    meta: {
      onAction: (type: OnboardingActionType, row: OnboardingAdminRow) => {
        if (type === "view") setActiveRow(row);
      },
    },
  });

  const onExportCsv = useCallback(() => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCsv(
      data,
      { headers: [...ONBOARDING_CSV_HEADERS], getValue: getCsvValue },
      `onboarding-${new Date().toISOString().split("T")[0]}`,
    );
  }, [table]);

  const setColumnFilterValue = (columnId: string, value: string) => {
    const nextValue = value === "all" ? undefined : value;
    table.getColumn(columnId)?.setFilterValue(nextValue);
  };

  const onExportHeadshots = useCallback(async () => {
    if (!termId) return;
    setIsExportingHeadshots(true);
    try {
      const blob = await downloadTeamHeadshots(termId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `onboarding-headshots.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingHeadshots(false);
    }
  }, [termId]);

  return (
    <>
      <Dialog
        open={!!activeRow}
        onOpenChange={(open) => !open && setActiveRow(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Onboarding Answers</DialogTitle>
          </DialogHeader>
          {activeRow?.submission ? (
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold">
                  {[activeRow.first_name, activeRow.last_name]
                    .filter(Boolean)
                    .join(" ") || "—"}
                </span>
                <Badge variant="secondary">{activeRow.user_role}</Badge>
                <Badge variant="outline">
                  {activeRow.submission_role_name ||
                    activeRow.exec_position_name ||
                    activeRow.user_role}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Personal Email
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.submission.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Waterloo Email
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Academic Term
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.submission.term_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Location
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.submission.in_waterloo || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Role
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.submission_role_name ||
                      activeRow.exec_position_name ||
                      activeRow.user_role}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Headshot
                  </p>
                  {activeRow.submission.headshot_url &&
                  !activeRow.submission.headshot_url.includes("team.png") ? (
                    <a
                      href={activeRow.submission.headshot_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-primary underline"
                    >
                      View file
                    </a>
                  ) : (
                    <p className="text-sm font-medium">None uploaded</p>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Discord
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.submission.discord}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Instagram Consent
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.submission.consent_instagram ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Instagram
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.submission.instagram || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Data Sci Competency
                  </p>
                  <p className="text-sm font-medium">
                    {activeRow.submission.datasci_competency}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Anything Else
                </p>
                <p className="text-sm font-medium whitespace-pre-wrap">
                  {activeRow.submission.anything_else || "—"}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              This exec has not submitted onboarding yet.
            </div>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Card className="p-6 w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Exec Onboarding</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {table.getFilteredRowModel().rows.length} records
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Search name, email, or position..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="sm:w-80 h-9"
            />
            <Button
              onClick={onExportHeadshots}
              variant="outline"
              size="sm"
              disabled={!termId || isExportingHeadshots}
            >
              <Image className="mr-2 h-4 w-4" />
              {isExportingHeadshots ? "Exporting..." : "Export Headshots"}
            </Button>
            <Button onClick={onExportCsv} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) => setColumnFilterValue("status", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn("user_role")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) => setColumnFilterValue("user_role", value)}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn("term_type")?.getFilterValue() as string) ??
              "all"
            }
            onValueChange={(value) => setColumnFilterValue("term_type", value)}
          >
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Term Type" />
            </SelectTrigger>
            <SelectContent>
              {TERM_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn("position")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) => setColumnFilterValue("position", value)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              {positionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border border-border mt-4 overflow-x-auto">
          <Table>
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
              {table.getRowModel().rows.length ? (
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
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
