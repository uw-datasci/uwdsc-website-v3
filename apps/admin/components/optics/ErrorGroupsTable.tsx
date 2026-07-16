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
import type { RaftErrorGroup, RaftGroupFilters } from "@uwdsc/common/types";
import { formatRaftDate, SeverityBadge, truncateText } from "./utils";
import { ErrorDetailSheet } from "./ErrorDetailSheet";

interface ErrorGroupsTableProps {
  readonly groups: RaftErrorGroup[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly filters: RaftGroupFilters;
  readonly onPageChange: (page: number) => void;
  readonly onResolvedChange: () => void;
}

export function ErrorGroupsTable({
  groups,
  total,
  page,
  pageSize,
  filters,
  onPageChange,
  onResolvedChange,
}: ErrorGroupsTableProps) {
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<RaftErrorGroup | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const openGroup = (group: RaftErrorGroup) => {
    setSelectedGroup(group);
    setSelectedErrorId(group.latest_id);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Error triage</CardTitle>
          <CardDescription>Grouped by app, endpoint, and error message</CardDescription>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No errors match the current filters.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>App</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Last seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow
                      key={`${group.app_name}:${group.endpoint}:${group.error_message}`}
                      className="cursor-pointer"
                      onClick={() => openGroup(group)}
                    >
                      <TableCell className="font-medium">{group.app_name}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{group.endpoint}</TableCell>
                      <TableCell className="max-w-[260px]">
                        {truncateText(group.error_message, 60)}
                      </TableCell>
                      <TableCell className="text-right">{group.count}</TableCell>
                      <TableCell>
                        <SeverityBadge severity={group.latest_severity} />
                      </TableCell>
                      <TableCell>
                        {group.resolved_count}/{group.count}
                      </TableCell>
                      <TableCell>{formatRaftDate(group.last_seen)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} groups)
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

      <ErrorDetailSheet
        errorId={selectedErrorId}
        group={selectedGroup}
        filters={filters}
        open={selectedErrorId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedErrorId(null);
            setSelectedGroup(null);
          }
        }}
        onResolvedChange={onResolvedChange}
        onSelectError={setSelectedErrorId}
      />
    </>
  );
}
