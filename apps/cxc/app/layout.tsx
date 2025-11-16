import "@uwdsc/ui/globals.css";
import { Geist, Geist_Mono, Host_Grotesk } from "next/font/google";
import { ThemeProvider } from "@uwdsc/ui";
import type { Metadata, Viewport } from "next";
import { baseMetadata, baseViewport } from "@/lib/metadata";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "CxC - UWaterloo Data Science Competition",
    template: "%s | CxC - UWaterloo DSC",
  },
  description:
    "UWaterloo's premier data science competition bridging students and industry. Tackle real-world challenges, compete for prizes, and showcase innovative data science solutions.",
  keywords:
    "data science, competition, hackathon, uwaterloo, machine learning, analytics, cxc, conrad centre",
  openGraph: {
    type: "website",
    title: "CxC - UWaterloo Data Science Competition",
    description:
      "UWaterloo's premier data science competition bridging students and industry",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CxC - UWaterloo Data Science Competition",
    description:
      "UWaterloo's premier data science competition bridging students and industry",
    images: ["/meta/og-image.png"],
  },
};

export const viewport: Viewport = baseViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hostGrotesk.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
