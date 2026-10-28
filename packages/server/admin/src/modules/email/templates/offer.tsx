import { Column, Row, Section, Text } from "@react-email/components";
import type { ReactElement } from "react";
import type { OfferEmailProps } from "../../../types/email";
import { RecruitingEmailLayout, recruitingMuted, recruitingText } from "./recruitingLayout";

export function getOfferSubject(positionName: string, termLabel: string): string {
  return `Your offer: ${positionName}, ${termLabel}`;
}

const cell = { padding: "4px 12px", fontSize: "13px", color: "#27272a" };
const label = { ...cell, color: "#63636e", width: "110px" };

export function OfferEmail({
  firstName,
  positionName,
  subteamName,
  termLabel,
  deadline,
  personalLine,
  signedBy,
}: Readonly<OfferEmailProps>): ReactElement {
  const role = subteamName ? `${positionName} · ${subteamName}` : positionName;

  return (
    <RecruitingEmailLayout
      preview={getOfferSubject(positionName, termLabel)}
      signedBy={signedBy}
    >
      <Text style={{ ...recruitingText, marginTop: "16px" }}>Hi {firstName},</Text>
      <Text style={recruitingText}>
        We&apos;d love to have you on the {subteamName ?? "DSC"} team as a{" "}
        <strong>{positionName}</strong> for {termLabel}.{personalLine ? ` ${personalLine}` : ""}
      </Text>
      <Section style={{ backgroundColor: "#f7f7f9", borderRadius: "6px", padding: "6px 0" }}>
        <Row>
          <Column style={label}>Role</Column>
          <Column style={{ ...cell, fontWeight: 600 }}>{role}</Column>
        </Row>
        <Row>
          <Column style={label}>Term</Column>
          <Column style={cell}>{termLabel}</Column>
        </Row>
        <Row>
          <Column style={label}>Respond by</Column>
          <Column style={{ ...cell, fontWeight: 600 }}>{deadline}</Column>
        </Row>
      </Section>
      <Text style={{ ...recruitingText, marginTop: "16px" }}>
        <strong>Reply to this email to accept or decline</strong> by {deadline}.
      </Text>
      <Text style={recruitingMuted}>
        If we don&apos;t hear back by the deadline, the offer expires and the seat may go to
        someone else. Questions? Just reply to this email.
      </Text>
    </RecruitingEmailLayout>
  );
}
