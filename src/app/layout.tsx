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
    default: "FlowSight Individual | Private work intelligence",
    template: "%s | FlowSight Individual",
  },
  description: siteConfig.description,
  applicationName: "FlowSight Individual",
  keywords: [
    "private productivity app",
    "local AI productivity",
    "deep work tracker",
    "focus analytics",
    "context switching",
    "proof of work",
    "FlowSight Individual",
  ],
  icons: {
    icon: [{ url: "/flowsight-icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/flowsight-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "FlowSight Individual | See your work. Own your focus.",
    description: siteConfig.description,
    siteName: "FlowSight",
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "FlowSight Individual private work intelligence" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowSight Individual | Private work intelligence",
    description: siteConfig.description,
    images: [absoluteUrl("/opengraph-image")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
