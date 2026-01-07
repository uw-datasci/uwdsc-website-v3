import crypto from "crypto";

const SLICE_VAL = 16; // Length of NFC ID to use

/**
 * Generate NFC ID for a profile
 * Uses HMAC SHA256 to create a deterministic ID from profile_id
 */
export function generateNfcId(profileId: string): string {
  const secret = process.env.NFC_HMAC_SECRET;
  if (!secret) {
    throw new Error("NFC_HMAC_SECRET environment variable is not set");
  }

  const mac = crypto
    .createHmac("sha256", secret)
    .update(`nfc:v1:${profileId}`, "utf8")
    .digest("base64url");

  return mac.slice(0, SLICE_VAL);
}

