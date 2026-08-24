import type { Metadata, Viewport } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { absoluteUrl, siteConfig } from "@/lib/site";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const displayFont = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfcfb" },
    { media: "(prefers-color-scheme: dark)", color: "#091114" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "FlowSight Individual: Private Focus & Productivity Tracker",
    template: "%s | FlowSight Individual",
  },
  description: siteConfig.description,
  applicationName: "FlowSight Individual",
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.legalName, url: siteConfig.companyUrl }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "technology",
  icons: {
    icon: [{ url: "/flowsight-icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/flowsight-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "FlowSight Individual | Private Focus & Productivity Tracker",
    description: siteConfig.description,
    siteName: "FlowSight",
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "FlowSight Individual private work intelligence" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowSight Individual | Private Focus & Productivity Tracker",
    description: siteConfig.description,
    images: [absoluteUrl("/opengraph-image")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
            ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
            ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
            : {}),
        },
      }
    : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
