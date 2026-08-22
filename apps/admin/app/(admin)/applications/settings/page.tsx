"use client";

import type { ReactNode } from "react";
import {
  PositionsManagementError,
  PositionsManagementForbidden,
  PositionsManagementLoading,
  PositionsManagementSection,
} from "@/components/applications/positions";
import {
  TermScheduleCard,
  TermScheduleEmpty,
  TermScheduleError,
  TermScheduleForbidden,
  TermScheduleLoading,
} from "@/components/applications/settings";
import { usePositionsManagement } from "@/hooks/usePositionsManagement";
import { useTermSchedule } from "@/hooks/useTermSchedule";

export default function ApplicationSettingsPage() {
  const { loadState, load, pendingIds, togglePosition } = usePositionsManagement();
  const {
    loadState: scheduleLoadState,
    load: loadSchedule,
    save: saveSchedule,
    saving,
  } = useTermSchedule();

  let scheduleMain: ReactNode;
  switch (scheduleLoadState.status) {
    case "loading":
      scheduleMain = <TermScheduleLoading />;
      break;
    case "forbidden":
      scheduleMain = <TermScheduleForbidden message={scheduleLoadState.message} />;
      break;
    case "error":
      scheduleMain = <TermScheduleError message={scheduleLoadState.message} onRetry={loadSchedule} />;
      break;
    case "empty":
      scheduleMain = <TermScheduleEmpty />;
      break;
    case "ready":
      scheduleMain = (
        <TermScheduleCard term={scheduleLoadState.term} saving={saving} onSave={saveSchedule} />
      );
      break;
    default: {
      const _exhaustive: never = scheduleLoadState;
      scheduleMain = _exhaustive;
    }
  }

  let positionsMain: ReactNode;
  switch (loadState.status) {
    case "loading":
      positionsMain = <PositionsManagementLoading />;
      break;
    case "forbidden":
      positionsMain = <PositionsManagementForbidden message={loadState.message} />;
      break;
    case "error":
      positionsMain = <PositionsManagementError message={loadState.message} onRetry={load} />;
      break;
    case "ready":
      positionsMain = (
        <PositionsManagementSection
          positions={loadState.positions}
          pendingIds={pendingIds}
          onToggle={togglePosition}
        />
      );
      break;
    default: {
      const _exhaustive: never = loadState;
      positionsMain = _exhaustive;
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage the application schedule and which roles members can apply to this cycle.
          Access is limited to Presidents.
        </p>
      </div>

      {scheduleMain}
      {positionsMain}
    </div>
  );
}
