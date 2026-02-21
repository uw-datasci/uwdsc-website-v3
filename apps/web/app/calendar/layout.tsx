import SectionWrapper from "@/components/SectionWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description: "View upcoming UWaterloo Data Science Club events and workshops",
  keywords: "data science, calendar, events, workshops, uwaterloo",
  openGraph: {
    title: "Calendar | UWaterloo Data Science Club",
    description:
      "View upcoming UWaterloo Data Science Club events and workshops",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary",
    description:
      "View upcoming UWaterloo Data Science Club events and workshops",
    images: ["/meta/og-image.png"],
  },
};

export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SectionWrapper className="pt-14 lg:pt-20">{children}</SectionWrapper>;
}
