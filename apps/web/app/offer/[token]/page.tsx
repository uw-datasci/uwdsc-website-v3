import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { offerResponseService } from "@uwdsc/core";
import { OfferMessage } from "@/components/offer/OfferMessage";
import { OfferResponse, type OfferStep } from "@/components/offer/OfferResponse";
import { createAuthService } from "@/lib/services";
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

  const { user } = await (await createAuthService()).getCurrentUser();
  if (!user) {
    const query = typeof r === "string" ? `?r=${encodeURIComponent(r)}` : "";
    redirect(`/login?redirect=${encodeURIComponent(`/offer/${token}${query}`)}`);
  }

  const lookup = await offerResponseService.getByToken(token, user.id);
  if (lookup.status === "invalid") {
    return (
      <OfferMessage
        title="This link isn't valid"
        body="Open the full link from your offer email. If it still doesn't work, reply to that email."
      />
    );
  }
  if (lookup.status === "wrong_account") {
    return (
      <OfferMessage
        title="This offer is for a different account"
        body={`You're signed in as ${user.email ?? "another account"}. Log out, then open the link again and sign in with the account you applied with. Can't get in? Reply to your offer email and we will record your answer.`}
      />
    );
  }
  const { view } = lookup;

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
