/**
 * Result of scanning another member's passport QR code.
 * The scan is recorded for every outcome except a duplicate; a spin
 * only happens when the user is eligible for the event's stamp.
 */
export type ScanOutcome =
  | { outcome: "already_scanned" }
  | { outcome: "already_has_stamp" }
  | { outcome: "lost"; probability: number }
  | { outcome: "won"; probability: number; stampId: string };

/** Body of POST /api/passport/scan (params carried by the QR code). */
export interface PassportScanRequest {
  membership_id: string;
  event_id: string;
  token: string;
}
