const TIME_STEP_SECONDS = 30;

function getCurrentTimeStep(): number {
  return Math.floor(Date.now() / (TIME_STEP_SECONDS * 1000));
}

export function getTimeNextStep(): number {
  const elapsed = (Date.now() / 1000) % TIME_STEP_SECONDS;
  return Math.ceil(TIME_STEP_SECONDS - elapsed) * 1000;
}

export async function generateCheckInToken(userId: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(userId);
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const timeStep = getCurrentTimeStep();
  const message = encoder.encode(String(timeStep));
  const signature = await crypto.subtle.sign("HMAC", key, message);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function buildPassportQRValue({
  userId,
  membershipId,
  eventId,
}: {
  userId: string;
  membershipId: string | null;
  eventId: string | null;
}): Promise<string> {
  const token = await generateCheckInToken(userId);
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001";
  const url = new URL("/checkin", adminUrl);

  if (membershipId) url.searchParams.set("membership_id", membershipId);
  if (eventId) url.searchParams.set("event_id", eventId);
  url.searchParams.set("token", token);

  return url.toString();
}
