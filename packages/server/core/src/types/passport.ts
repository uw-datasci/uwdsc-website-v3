/** Row shape for `memberships` lookups by id (scanned member). */
export interface ScannedMembership {
  id: string;
  profile_id: string;
}

/** Row shape for `events` lookups during a scan: the stamp is the prize. */
export interface ScanEvent {
  id: string;
  stamp_id: string | null;
}
