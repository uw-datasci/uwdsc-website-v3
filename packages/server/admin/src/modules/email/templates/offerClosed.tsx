import { Text } from "@react-email/components";
import type { ReactElement } from "react";
import type { OfferClosedEmailProps, OfferClosedReason } from "../../../types/email";
import { RecruitingEmailLayout, recruitingText } from "./recruitingLayout";

export function getOfferClosedSubject(
  positionName: string,
  termLabel: string,
  reason: OfferClosedReason
): string {
  const lead =
    reason === "withdrawn" ? "Your offer has been withdrawn" : "Your offer has closed";
  return `${lead}: ${positionName}, ${termLabel}`;
}

export function OfferClosedEmail({
  firstName,
  positionName,
  termLabel,
  signedBy,
  reason,
}: Readonly<OfferClosedEmailProps>): ReactElement {
  return (
    <RecruitingEmailLayout
      preview={getOfferClosedSubject(positionName, termLabel, reason)}
      signedBy={signedBy}
    >
      <Text style={{ ...recruitingText, marginTop: "16px" }}>Hi {firstName},</Text>
      {reason === "withdrawn" ? (
        <Text style={recruitingText}>
          We&apos;ve withdrawn our offer for <strong>{positionName}</strong> for {termLabel}, so
          the link in the earlier email no longer works. We&apos;re sorry for any confusion.
        </Text>
      ) : (
        <Text style={recruitingText}>
          Thanks for considering our offer for <strong>{positionName}</strong> for {termLabel}.
          We didn&apos;t hear back before we finalized the team, so this offer has now closed.
        </Text>
      )}
      <Text style={recruitingText}>
        {reason === "withdrawn"
          ? "If you have questions, just reply to this email."
          : "If you think this is a mistake, just reply to this email."}
      </Text>
    </RecruitingEmailLayout>
  );
}
