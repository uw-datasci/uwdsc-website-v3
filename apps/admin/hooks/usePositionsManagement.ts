"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ManagablePosition } from "@uwdsc/common/types";
import {
  addAvailablePosition,
  getManagablePositions,
  removeAvailablePosition,
} from "@/lib/api/positions";

export type PositionsLoadState =
  | { status: "loading" }
  | { status: "forbidden"; message: string }
  | { status: "error"; message: string }
  | { status: "ready"; positions: ManagablePosition[] };

export function usePositionsManagement() {
  const [loadState, setLoadState] = useState<PositionsLoadState>({
    status: "loading",
  });
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const load = useCallback(async () => {
    setLoadState({ status: "loading" });
    try {
      const positions = await getManagablePositions();
      setLoadState({ status: "ready", positions });
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      const message =
        err instanceof Error ? err.message : "Failed to load positions";
      if (status === 401) {
        setLoadState({
          status: "forbidden",
          message: "Only Presidents can manage application positions.",
        });
        return;
      }
      setLoadState({ status: "error", message });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** Patches a single position in place, no-op unless the list is currently loaded. */
  const patchPosition = useCallback(
    (execPositionId: number, patch: Partial<ManagablePosition>) => {
      setLoadState((state) => {
        if (state.status !== "ready") return state;
        return {
          status: "ready",
          positions: state.positions.map((p) =>
            p.exec_position_id === execPositionId ? { ...p, ...patch } : p,
          ),
        };
      });
    },
    [],
  );

  const togglePosition = useCallback(
    async (position: ManagablePosition, nextAvailable: boolean) => {
      setPendingIds((prev) => new Set(prev).add(position.exec_position_id));
      patchPosition(position.exec_position_id, { is_available: nextAvailable });

      try {
        if (nextAvailable) {
          const { availableId } = await addAvailablePosition(
            position.exec_position_id,
          );
          patchPosition(position.exec_position_id, {
            available_id: availableId,
          });
          toast.success(`${position.name} is now open for applications`);
        } else if (position.available_id !== null) {
          await removeAvailablePosition(position.available_id);
          patchPosition(position.exec_position_id, { available_id: null });
          toast.success(`${position.name} is now closed for applications`);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        toast.error(message);
        // Revert the optimistic flip since the request failed.
        patchPosition(position.exec_position_id, {
          is_available: position.is_available,
          available_id: position.available_id,
        });
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(position.exec_position_id);
          return next;
        });
      }
    },
    [patchPosition],
  );

  return { loadState, load, pendingIds, togglePosition };
}
