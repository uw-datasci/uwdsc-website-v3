import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Verification | UWaterloo Data Science Club",
  description:
    "Submit your proof of payment to have your UWaterloo Data Science Club membership verified.",
  robots: { index: false, follow: false },
};

export default function MembershipLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
