/**
 * Re-generate TOTP token for a given user ID and time step.
 */
export async function generateTokenForStep(
  userId: string,
  timeStep: number,
): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(userId);
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const message = encoder.encode(String(timeStep));
  const signature = await crypto.subtle.sign("HMAC", key, message);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
