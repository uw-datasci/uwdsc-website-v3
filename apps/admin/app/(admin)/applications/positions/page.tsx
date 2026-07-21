"use client";

import type { ReactNode } from "react";
import {
  PositionsManagementError,
  PositionsManagementForbidden,
  PositionsManagementLoading,
  PositionsManagementSection,
} from "@/components/applications/positions";
import { usePositionsManagement } from "@/hooks/usePositionsManagement";

export default function PositionsPage() {
  const { loadState, load, pendingIds, togglePosition } =
    usePositionsManagement();

  let main: ReactNode;
  switch (loadState.status) {
    case "loading":
      main = <PositionsManagementLoading />;
      break;
    case "forbidden":
      main = <PositionsManagementForbidden message={loadState.message} />;
      break;
    case "error":
      main = (
        <PositionsManagementError message={loadState.message} onRetry={load} />
      );
      break;
    case "ready":
      main = (
        <PositionsManagementSection
          positions={loadState.positions}
          pendingIds={pendingIds}
          onToggle={togglePosition}
        />
      );
      break;
    default: {
      const _exhaustive: never = loadState;
      main = _exhaustive;
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Application Positions</h1>
        <p className="text-muted-foreground">
          Choose which roles are open for applications this cycle. Access is
          limited to Presidents.
        </p>
      </div>

      {main}
    </div>
  );
}
