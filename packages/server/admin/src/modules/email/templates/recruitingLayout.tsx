import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactElement, ReactNode } from "react";

export const recruitingText = {
  color: "#27272a",
  lineHeight: "1.6" as const,
  margin: "0 0 14px 0",
  fontSize: "15px",
};

export const recruitingMuted = { ...recruitingText, color: "#63636e", fontSize: "13px" };

/** Shared shell for offer, rejection and offer-closed emails. */
export function RecruitingEmailLayout({
  preview,
  signedBy,
  children,
}: Readonly<{ preview: string; signedBy: string; children: ReactNode }>): ReactElement {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: "#f6f6f8",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            margin: "32px auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "32px",
            border: "1px solid #ececf0",
          }}
        >
          <Text
            style={{
              ...recruitingText,
              fontSize: "13px",
              fontWeight: 600,
              paddingBottom: "12px",
              borderBottom: "1px solid #ececf0",
            }}
          >
            UW Data Science Club
          </Text>
          <Section>{children}</Section>
          <Text style={{ ...recruitingText, marginTop: "20px", marginBottom: "0" }}>
            {signedBy}
            <br />
            Presidents, UW Data Science Club
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
