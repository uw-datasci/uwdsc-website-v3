/**
 * TOTP-based check-in token utilities.
 *
 * Uses Web Crypto API (HMAC-SHA256) with a 30-second time step.
 * The token changes every 30 seconds, preventing screenshot abuse.
 */

const TIME_STEP_SECONDS = 30;

/**
 * Get the current time step (floors current time to 30-second intervals)
 */
export function getCurrentTimeStep(): number {
  return Math.floor(Date.now() / (TIME_STEP_SECONDS * 1000));
}

/**
 * Generate a time-based check-in token using HMAC-SHA256.
 *
 * @param userId - The user's UUID (used as HMAC key material)
 * @returns A hex-encoded token string
 */
export async function generateCheckInToken(userId: string): Promise<string> {
  const encoder = new TextEncoder();

  // Use userId as the HMAC key
  const keyMaterial = encoder.encode(userId);
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  // Use the current time step as the message
  const timeStep = getCurrentTimeStep();
  const message = encoder.encode(String(timeStep));

  const signature = await crypto.subtle.sign("HMAC", key, message);

  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Build the full QR code data URL with check-in token.
 */
export async function buildCheckInQRData(params: {
  baseUrl: string;
  eventId: string;
  membershipId: string;
  userId: string;
}): Promise<string> {
  const token = await generateCheckInToken(params.userId);

  const url = new URL("/api/checkin", params.baseUrl);
  url.searchParams.set("event_id", params.eventId);
  url.searchParams.set("membership_id", params.membershipId);
  url.searchParams.set("token", token);

  return url.toString();
}

/**
 * Returns the number of seconds remaining in the current time step.
 */
export function getTimeNextStep(): number {
  const now = Date.now() / 1000;
  const elapsed = now % TIME_STEP_SECONDS;
  return Math.ceil(TIME_STEP_SECONDS - elapsed);
}
