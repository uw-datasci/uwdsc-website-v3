import type { OfferLinkResponseInput } from "@uwdsc/common/schemas";
import type { PublicOfferView } from "@uwdsc/common/types";
import { createApiError } from "./errors";

export async function respondToOffer(
  token: string,
  input: OfferLinkResponseInput
): Promise<PublicOfferView> {
  const response = await fetch(`/api/offers/${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json();
  if (!response.ok) throw createApiError(data, response.status);
  return data;
}
