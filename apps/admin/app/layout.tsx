import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";

import "@uwdsc/ui/globals.css";
import { baseMetadata, baseViewport } from "@/lib/metadata";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "UW Data Science Club — Admin",
    template: "%s | UW DSC Admin",
  },
  description: "Internal tools for the University of Waterloo Data Science Club",
};

export const viewport: Viewport = baseViewport;

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
