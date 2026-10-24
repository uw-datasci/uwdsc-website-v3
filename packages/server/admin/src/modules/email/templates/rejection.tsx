import { Text } from "@react-email/components";
import type { ReactElement } from "react";
import type { RejectionEmailProps } from "../../../types/email";
import { RecruitingEmailLayout, recruitingText } from "./recruitingLayout";

export function getRejectionSubject(termLabel: string): string {
  return `Your DSC exec application for ${termLabel}`;
}

export function RejectionEmail({
  firstName,
  termLabel,
  signedBy,
}: Readonly<RejectionEmailProps>): ReactElement {
  return (
    <RecruitingEmailLayout preview={getRejectionSubject(termLabel)} signedBy={signedBy}>
      <Text style={{ ...recruitingText, marginTop: "16px" }}>Hi {firstName},</Text>
      <Text style={recruitingText}>
        Thank you for applying to the {termLabel} DSC exec team. We had a lot of strong
        applicants this term, and we won&apos;t be moving forward with your application this
        time.
      </Text>
      <Text style={recruitingText}>
        We&apos;d love to keep seeing you at our events, and we hope you apply again in a future
        term.
      </Text>
    </RecruitingEmailLayout>
  );
}
