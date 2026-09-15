/** Result of scanning another member's passport QR code. */
export type ScanOutcome =
  | { outcome: "already_scanned" }
  | { outcome: "already_has_stamp" }
  | { outcome: "lost"; probability: number }
  | { outcome: "won"; probability: number; stampId: string };

/** Body of POST /api/passport/scan, carried by the QR code. */
export interface PassportScanRequest {
  membership_id: string;
  event_id: string;
  token: string;
}
