import type { ManagablePosition } from "@uwdsc/common/types";
import { createApiError } from "./error";

export async function getManagablePositions(): Promise<ManagablePosition[]> {
  const response = await fetch("/api/applications/positions");
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return (data as { positions: ManagablePosition[] }).positions;
}

export async function addAvailablePosition(
  positionId: number,
): Promise<{ availableId: number }> {
  const response = await fetch("/api/applications/positions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ positionId }),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data as { availableId: number };
}

export async function removeAvailablePosition(
  availableId: number,
): Promise<void> {
  const response = await fetch(`/api/applications/positions/${availableId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
}
