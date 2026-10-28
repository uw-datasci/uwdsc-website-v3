import { Button, Column, Row, Section, Text } from "@react-email/components";
import type { ReactElement } from "react";
import type { OfferEmailProps } from "../../../types/email";
import { RecruitingEmailLayout, recruitingMuted, recruitingText } from "./recruitingLayout";

export function getOfferSubject(positionName: string, termLabel: string): string {
  return `Your offer: ${positionName}, ${termLabel}`;
}

const cell = { padding: "4px 12px", fontSize: "13px", color: "#27272a" };
const label = { ...cell, color: "#63636e", width: "110px" };
const button = {
  display: "inline-block",
  padding: "11px 20px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
};

function withResponse(url: string, response: "accept" | "decline"): string {
  return `${url}${url.includes("?") ? "&" : "?"}r=${response}`;
}

export function OfferEmail({
  firstName,
  positionName,
  subteamName,
  termLabel,
  deadline,
  personalLine,
  signedBy,
  respondUrl,
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
        Please respond by <strong>{deadline}</strong>.
      </Text>
      <Section style={{ margin: "4px 0 8px" }}>
        <Button
          href={withResponse(respondUrl, "accept")}
          style={{ ...button, backgroundColor: "#7c3aed", color: "#ffffff" }}
        >
          Accept offer
        </Button>
        <Button
          href={withResponse(respondUrl, "decline")}
          style={{
            ...button,
            marginLeft: "8px",
            backgroundColor: "#ffffff",
            color: "#27272a",
            border: "1px solid #d4d4d8",
          }}
        >
          Decline
        </Button>
      </Section>
      <Text style={recruitingMuted}>
        If we don&apos;t hear back by the deadline, the offer expires and the seat may go to
        someone else. Questions? Just reply to this email.
      </Text>
    </RecruitingEmailLayout>
  );
}
