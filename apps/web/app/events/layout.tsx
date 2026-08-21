import SectionWrapper from "@/components/SectionWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Check in to UWaterloo Data Science Club events",
  keywords: "data science, events, check-in, uwaterloo",
  openGraph: {
    title: "Events | UWaterloo Data Science Club",
    description: "Check in to UWaterloo Data Science Club events",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary",
    description: "Check in to UWaterloo Data Science Club events",
    images: ["/meta/og-image.png"],
  },
};

export default function EventsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionWrapper className="lg:pt-20">{children}</SectionWrapper>;
}
