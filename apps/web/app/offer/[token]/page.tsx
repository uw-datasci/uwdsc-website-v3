import type { Metadata } from "next";
import { headers } from "next/headers";
import { offerResponseService } from "@uwdsc/core";
import { OfferMessage } from "@/components/offer/OfferMessage";
import { OfferResponse, type OfferStep } from "@/components/offer/OfferResponse";
import { allowOfferRequest } from "@/lib/utils/offer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your exec offer",
  robots: { index: false, follow: false },
};

const HOUR_MS = 60 * 60 * 1000;

interface OfferPageProps {
  readonly params: Promise<{ token: string }>;
  readonly searchParams: Promise<{ r?: string | string[] }>;
}

function initialStep(r: string | string[] | undefined): OfferStep {
  if (r === "accept") return "confirmAccept";
  if (r === "decline") return "confirmDecline";
  return "offer";
}

export default async function OfferPage({ params, searchParams }: OfferPageProps) {
  const [{ token }, { r }] = await Promise.all([params, searchParams]);

  if (!(await allowOfferRequest(await headers()))) {
    return (
      <OfferMessage
        title="Too many tries"
        body="Wait a few minutes, then open the link from your offer email again."
      />
    );
  }

  const view = await offerResponseService.getByToken(token);
  if (!view) {
    return (
      <OfferMessage
        title="This link isn't valid"
        body="Open the full link from your offer email. If it still doesn't work, reply to that email."
      />
    );
  }

  const hoursLeft = Math.max(
    0,
    Math.floor((new Date(view.expiresAt).getTime() - Date.now()) / HOUR_MS)
  );

  return (
    <OfferResponse
      key={`${view.state}-${view.respondedAt ?? ""}`}
      token={token}
      initialView={view}
      initialStep={initialStep(r)}
      hoursLeft={hoursLeft}
    />
  );
}
