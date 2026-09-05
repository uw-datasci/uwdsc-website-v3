import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "What the UWaterloo Data Science Club teaches, and resources from past workshops",
  keywords: "data science, workshops, uwaterloo, university of waterloo, learning",
  openGraph: {
    title: "Workshops | UWaterloo Data Science Club",
    description:
      "What the UWaterloo Data Science Club teaches, and resources from past workshops",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary",
    description:
      "What the UWaterloo Data Science Club teaches, and resources from past workshops",
    images: ["/meta/og-image.png"],
  },
};

export default function WorkshopsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
