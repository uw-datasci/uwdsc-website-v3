"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
} from "@uwdsc/ui";
import type { RaftError, RaftErrorGroup, RaftGroupFilters } from "@uwdsc/common/types";
import { getRaftError, getRaftOccurrences, setRaftErrorResolved } from "@/lib/api/raft";
import { formatRaftDate, SeverityBadge } from "./utils";

interface ErrorDetailSheetProps {
  readonly errorId: string | null;
  readonly group: RaftErrorGroup | null;
  readonly filters: RaftGroupFilters;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onResolvedChange: () => void;
  readonly onSelectError: (id: string) => void;
}

interface ErrorDetailState {
  error: RaftError | null;
  occurrences: RaftError[];
  loading: boolean;
  updating: boolean;
  loadError: string | null;
  toggleResolved: () => Promise<void>;
}

function useErrorDetail(
  open: boolean,
  errorId: string | null,
  group: RaftErrorGroup | null,
  filters: RaftGroupFilters,
  onResolvedChange: () => void,
): ErrorDetailState {
  const [error, setError] = useState<RaftError | null>(null);
  const [occurrences, setOccurrences] = useState<RaftError[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !errorId || !group) {
      setError(null);
      setOccurrences([]);
      setLoadError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    Promise.all([
      getRaftError(errorId),
      getRaftOccurrences({
        ...filters,
        appName: group.app_name,
        endpoint: group.endpoint,
        errorMessage: group.error_message,
        page: 1,
        pageSize: 10,
      }),
    ])
      .then(([detail, occurrenceResult]) => {
        if (cancelled) return;
        setError(detail);
        setOccurrences(occurrenceResult.errors);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, errorId, group, filters]);

  const toggleResolved = useCallback(async () => {
    if (!error) return;

    setUpdating(true);
    try {
      const updated = await setRaftErrorResolved(error.id, !error.resolved);
      setError(updated);
      setOccurrences((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      onResolvedChange();
    } catch (err) {
      setLoadError((err as Error).message);
    } finally {
      setUpdating(false);
    }
  }, [error, onResolvedChange]);

  return { error, occurrences, loading, updating, loadError, toggleResolved };
}

export function ErrorDetailSheet({
  errorId,
  group,
  filters,
  open,
  onOpenChange,
  onResolvedChange,
  onSelectError,
}: ErrorDetailSheetProps) {
  const { error, occurrences, loading, updating, loadError, toggleResolved } = useErrorDetail(
    open,
    errorId,
    group,
    filters,
    onResolvedChange,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto px-6 pb-6 pt-6 sm:max-w-xl">
        <SheetHeader className="p-0">
          <SheetTitle>Error detail</SheetTitle>
          <SheetDescription>
            {group ? `${group.app_name} · ${group.endpoint}` : "Quarantined error from Raft"}
          </SheetDescription>
        </SheetHeader>

        <ErrorDetailBody
          loading={loading}
          loadError={loadError}
          error={error}
          group={group}
          occurrences={occurrences}
          updating={updating}
          onToggleResolved={toggleResolved}
          onSelectError={onSelectError}
        />
      </SheetContent>
    </Sheet>
  );
}

function ErrorDetailBody({
  loading,
  loadError,
  error,
  group,
  occurrences,
  updating,
  onToggleResolved,
  onSelectError,
}: {
  readonly loading: boolean;
  readonly loadError: string | null;
  readonly error: RaftError | null;
  readonly group: RaftErrorGroup | null;
  readonly occurrences: RaftError[];
  readonly updating: boolean;
  readonly onToggleResolved: () => Promise<void>;
  readonly onSelectError: (id: string) => void;
}) {
  if (loading) return <ErrorDetailSkeleton />;
  if (loadError) return <p className="mt-6 text-sm text-destructive">{loadError}</p>;
  if (!error) return null;

  return (
    <ErrorDetailContent
      error={error}
      group={group}
      occurrences={occurrences}
      updating={updating}
      onToggleResolved={onToggleResolved}
      onSelectError={onSelectError}
    />
  );
}

function ErrorDetailSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function ErrorDetailContent({
  error,
  group,
  occurrences,
  updating,
  onToggleResolved,
  onSelectError,
}: {
  readonly error: RaftError;
  readonly group: RaftErrorGroup | null;
  readonly occurrences: RaftError[];
  readonly updating: boolean;
  readonly onToggleResolved: () => Promise<void>;
  readonly onSelectError: (id: string) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={error.severity} />
        <Badge variant="outline">{error.environment}</Badge>
        <Badge variant={error.resolved ? "secondary" : "destructive"}>
          {error.resolved ? "Resolved" : "Open"}
        </Badge>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Message</h3>
        <p className="rounded-md border bg-muted/40 p-3 text-sm break-words">
          {error.error_message}
        </p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Stack trace</h3>
          <Button
            size="sm"
            variant={error.resolved ? "outline" : "default"}
            disabled={updating}
            onClick={onToggleResolved}
          >
            {error.resolved ? "Mark unresolved" : "Mark resolved"}
          </Button>
        </div>
        <ScrollArea className="h-48 rounded-md border bg-muted/40 p-3">
          <pre className="text-xs whitespace-pre-wrap break-words font-mono">
            {error.stack_trace ?? "No stack trace captured"}
          </pre>
        </ScrollArea>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Metadata</h3>
        <ScrollArea className="h-32 rounded-md border bg-muted/40 p-3">
          <pre className="text-xs whitespace-pre-wrap break-words font-mono">
            {JSON.stringify(error.metadata, null, 2)}
          </pre>
        </ScrollArea>
      </section>

      <OccurrencesList
        error={error}
        group={group}
        occurrences={occurrences}
        onSelectError={onSelectError}
      />

      <p className="text-xs text-muted-foreground">
        Captured {formatRaftDate(error.created_at)}
      </p>
    </div>
  );
}

function OccurrencesList({
  error,
  group,
  occurrences,
  onSelectError,
}: {
  readonly error: RaftError;
  readonly group: RaftErrorGroup | null;
  readonly occurrences: RaftError[];
  readonly onSelectError: (id: string) => void;
}) {
  if (occurrences.length <= 1) return null;

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium">
        Occurrences ({group?.count ?? occurrences.length})
      </h3>
      <div className="space-y-2">
        {occurrences.map((occurrence) => (
          <button
            key={occurrence.id}
            type="button"
            className={`w-full rounded-md border p-3 text-left text-sm transition-colors hover:bg-muted/50 ${
              occurrence.id === error.id ? "border-primary" : ""
            }`}
            onClick={() => onSelectError(occurrence.id)}
          >
            <div className="flex items-center justify-between gap-2">
              <SeverityBadge severity={occurrence.severity} />
              <span className="text-xs text-muted-foreground">
                {formatRaftDate(occurrence.created_at)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {occurrence.resolved ? "Resolved" : "Open"}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
