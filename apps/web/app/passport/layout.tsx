import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Passport | UWaterloo Data Science Club",
  description:
    "Collect achievements, stamps, and track your journey as a Data Science Club member at the University of Waterloo.",
  keywords:
    "data science, achievements, passport, gamification, uwaterloo, membership, challenges",
  openGraph: {
    title: "My Passport | UWaterloo Data Science Club",
    description:
      "Track your Data Science Club journey with achievements, event stamps, and challenges. Build your member passport at UW.",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary",
    description:
      "Track your Data Science Club journey with achievements, event stamps, and challenges. Build your member passport at UW.",
    images: ["/meta/og-image.png"],
  },
};

export default function PassportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
