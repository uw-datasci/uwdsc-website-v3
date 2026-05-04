"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uwdsc/ui";
import { Download, Image, Search } from "lucide-react";
import type { OnboardingAdminRow, Term } from "@uwdsc/common/types";
import { exportToCsv } from "@/lib/utils/csv";
import { downloadTeamHeadshots } from "@/lib/api/onboarding";

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
  if (key === "name")
    return [row.first_name, row.last_name].filter(Boolean).join(" ");
  if (key === "position")
    return row.submission_role_name || row.exec_position_name || row.user_role;
  if (key === "submitted") return row.submission ? "yes" : "no";
  const s = row.submission;
  switch (key) {
    case "term_type":
      return s?.term_type ?? "";
    case "in_waterloo":
      return s?.in_waterloo ?? "";
    case "discord":
      return s?.discord ?? "";
    case "datasci_competency":
      return s?.datasci_competency ?? "";
    case "instagram":
      return s?.instagram ?? "";
    case "additional_comments":
      return s?.anything_else ?? "";
    default:
      return (row as unknown as Record<string, unknown>)[key];
  }
}

interface OnboardingHeaderProps {
  readonly rows: OnboardingAdminRow[];
  readonly term: Term | null;
  readonly termId: string | null;
  readonly onFilteredRowsChange: (filtered: OnboardingAdminRow[]) => void;
}

export function OnboardingHeader({
  rows,
  term,
  termId,
  onFilteredRowsChange,
}: OnboardingHeaderProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [termTypeFilter, setTermTypeFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
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
        .map((l) => ({ value: l, label: l })),
    );
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const name = [row.first_name, row.last_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const email = (row.email ?? "").toLowerCase();
      const position = (
        (row.submission_role_name || row.exec_position_name || row.user_role) ??
        ""
      ).toLowerCase();
      const hasSubmission = !!row.submission;

      if (q && !name.includes(q) && !email.includes(q) && !position.includes(q))
        return false;
      if (statusFilter === "submitted" && !hasSubmission) return false;
      if (statusFilter === "missing" && hasSubmission) return false;
      if (roleFilter !== "all" && row.user_role !== roleFilter) return false;
      if (
        termTypeFilter !== "all" &&
        row.submission?.term_type !== termTypeFilter
      )
        return false;
      if (positionFilter !== "all" && position !== positionFilter.toLowerCase())
        return false;
      return true;
    });
  }, [rows, search, statusFilter, roleFilter, termTypeFilter, positionFilter]);

  useEffect(() => {
    onFilteredRowsChange(filtered);
  }, [filtered, onFilteredRowsChange]);

  const submittedCount = rows.filter((r) => !!r.submission).length;

  const onExportCsv = useCallback(() => {
    exportToCsv(
      filtered,
      { headers: [...ONBOARDING_CSV_HEADERS], getValue: getCsvValue },
      `onboarding-${new Date().toISOString().split("T")[0]}`,
    );
  }, [filtered]);

  const onExportHeadshots = useCallback(async () => {
    if (!termId) return;
    setIsExportingHeadshots(true);
    try {
      const blob = await downloadTeamHeadshots(termId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "onboarding-headshots.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingHeadshots(false);
    }
  }, [termId]);

  return (
    <div className="mb-4 flex flex-col gap-3">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Team Onboarding</h1>
          <p className="text-sm text-muted-foreground">
            {term ? `Viewing ${term.code} submissions.` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1 px-2 py-1">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold tabular-nums">{rows.length}</span>
            </Badge>
            <Badge className="gap-1 px-2 py-1 bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-500/30">
              <span className="text-muted-foreground">Submitted</span>
              <span className="font-semibold tabular-nums">
                {submittedCount}
              </span>
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {filtered.length} record{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
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

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search name, email, position…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 w-56"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-8 w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={termTypeFilter} onValueChange={setTermTypeFilter}>
          <SelectTrigger className="h-8 w-40">
            <SelectValue placeholder="Term Type" />
          </SelectTrigger>
          <SelectContent>
            {TERM_TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="h-8 w-48">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            {positionOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
