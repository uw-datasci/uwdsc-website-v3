import { Text } from "@react-email/components";
import type { ReactElement } from "react";
import type { OfferClosedEmailProps } from "../../../types/email";
import { RecruitingEmailLayout, recruitingText } from "./recruitingLayout";

export function getOfferClosedSubject(positionName: string, termLabel: string): string {
  return `Your offer has closed: ${positionName}, ${termLabel}`;
}

export function OfferClosedEmail({
  firstName,
  positionName,
  termLabel,
  signedBy,
}: Readonly<OfferClosedEmailProps>): ReactElement {
  return (
    <RecruitingEmailLayout
      preview={getOfferClosedSubject(positionName, termLabel)}
      signedBy={signedBy}
    >
      <Text style={{ ...recruitingText, marginTop: "16px" }}>Hi {firstName},</Text>
      <Text style={recruitingText}>
        Thanks for considering our offer for <strong>{positionName}</strong> for {termLabel}. We
        didn&apos;t hear back before we finalized the team, so this offer has now closed.
      </Text>
      <Text style={recruitingText}>
        If you think this is a mistake, just reply to this email.
      </Text>
    </RecruitingEmailLayout>
  );
}
