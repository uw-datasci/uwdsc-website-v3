import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore student-led projects built by UWaterloo Data Science Club members",
  keywords: "data science, projects, uwaterloo, university of waterloo, machine learning",
  openGraph: {
    title: "Projects | UWaterloo Data Science Club",
    description: "Explore student-led projects built by UWaterloo Data Science Club members",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary",
    description: "Explore student-led projects built by UWaterloo Data Science Club members",
    images: ["/meta/og-image.png"],
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
