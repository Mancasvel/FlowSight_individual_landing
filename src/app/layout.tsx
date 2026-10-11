import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { absoluteUrl, siteConfig } from "@/lib/site";

const bodyFont = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-body",
});

const displayFont = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-display",
});

const monoFont = localFont({ src: "../../public/fonts/geist-mono-latin.woff2", weight: "100 900", display: "swap", variable: "--font-solo-mono" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfcfb",
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
  authors: [{ name: siteConfig.name, url: siteConfig.companyUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  icons: {
    icon: [{ url: "/flowsight-icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/flowsight-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "FlowSight Solo | Understand your work",
    description: siteConfig.description,
    siteName: "FlowSight",
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "FlowSight Individual private work intelligence" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowSight Solo | Understand your work",
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
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/json" id="solo-design-contract" dangerouslySetInnerHTML={{ __html: JSON.stringify({ seed: "cbb42e24", direction: "User-pinned flowsight.site identity: white mode, 56px background grid, navy and teal, exact FlowSight capitalization; clear product demonstrations; real FlowSight 6.1.0 Today and Insights captures; illustrative calendar and weekly report components", thesis: "Plan, focus and review with private local AI", build: "code-led", scope: "Solo landing and offer preview" }) }} />
        {children}
      </body>
    </html>
  );
}
