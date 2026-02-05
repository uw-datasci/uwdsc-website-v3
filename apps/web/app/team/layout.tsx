import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the UWaterloo Data Science Club team members and executives",
  keywords: "data science, team, uwaterloo, university of waterloo, executives",
  openGraph: {
    title: "Team | UWaterloo Data Science Club",
    description:
      "Meet the UWaterloo Data Science Club team members and executives",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary",
    description:
      "Meet the UWaterloo Data Science Club team members and executives",
    images: ["/meta/og-image.png"],
  },
};

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
