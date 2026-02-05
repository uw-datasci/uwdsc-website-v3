import type { Metadata } from "next";
import { ApplicationBackground } from "@/components/application/ApplicationBackground";
import { AppProgressProvider } from "@/contexts/AppProgressContext";

export const metadata: Metadata = {
  title: "Apply",
  description:
    "Apply to join the University of Waterloo Data Science Club executive team",
  keywords:
    "data science, application, uwaterloo, executive, join, recruitment",
  openGraph: {
    title: "Apply | UWaterloo Data Science Club",
    description:
      "Apply to join the University of Waterloo Data Science Club executive team",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary",
    description:
      "Apply to join the University of Waterloo Data Science Club executive team",
    images: ["/meta/og-image.png"],
  },
};

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProgressProvider>
      <ApplicationBackground>{children}</ApplicationBackground>
    </AppProgressProvider>
  );
}
