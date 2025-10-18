import "@uwdsc/ui/globals.css";
import "../styles.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@uwdsc/ui";
import { Navbar } from "@/components/Navbar";
import { baseMetadata } from "@/lib/metadata";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "UWaterloo Data Science Club",
    template: "%s | UWaterloo Data Science Club",
  },
  description: "University of Waterloo Data Science Club website",
  openGraph: {
    type: "website",
    title: "UWaterloo Data Science Club",
    description: "University of Waterloo Data Science Club website",
    images: ["/meta/og-image.png"],
  },
  twitter: {
    card: "summary",
    title: "UWaterloo Data Science Club",
    description: "University of Waterloo Data Science Club website",
    images: ["/meta/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
