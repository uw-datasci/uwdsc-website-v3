/**
 * Passport API (QR scan / mystery box)
 */

import type { PassportScanRequest, ScanOutcome } from "@uwdsc/common/types";
import { createApiError } from "./errors";

export async function scanPassportQr(
  params: PassportScanRequest,
): Promise<ScanOutcome> {
  const response = await fetch("/api/passport/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
