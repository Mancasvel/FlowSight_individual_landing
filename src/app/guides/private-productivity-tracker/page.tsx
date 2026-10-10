import type { Metadata } from "next";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { IndividualSearchGuide } from "@/components/individual-search-guide";
import { absoluteUrl, siteConfig } from "@/lib/site";

const title = "Private Productivity Tracker Guide";
const description =
  "Learn how a private productivity tracker can reveal deep work, context switching, and daily progress with local AI instead of screenshot surveillance.";
const canonical = absoluteUrl("/guides/private-productivity-tracker");

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "private productivity tracker",
    "private focus tracker",
    "deep work tracker",
    "context switching tracker",
    "local AI productivity app",
    "time tracker alternative",
  ],
  alternates: { canonical },
  openGraph: {
    type: "article",
    url: canonical,
    title: `${title} | FlowSight Individual`,
    description,
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "FlowSight Individual private productivity tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | FlowSight Individual`,
    description,
    images: [absoluteUrl("/opengraph-image")],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  url: canonical,
  mainEntityOfPage: canonical,
  datePublished: "2026-08-24",
  dateModified: "2026-08-24",
  image: absoluteUrl("/opengraph-image"),
  author: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.companyUrl,
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.companyUrl,
  },
};

export default function PrivateProductivityTrackerGuidePage() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-lg bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--canvas)] transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }}
      />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[color:var(--header)] backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-[88rem] items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            aria-label="FlowSight Individual home"
            className="flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]"
          >
            <Image src="/flowsight-icon-180.png" alt="" width={28} height={28} className="h-7 w-7" priority />
            <span className="font-heading text-lg font-semibold tracking-[-0.035em] text-[var(--ink)]">FlowSight</span>
            <span className="hidden border-l border-[var(--line-strong)] pl-2.5 text-xs font-semibold text-[var(--muted)] sm:inline">Individual</span>
          </Link>
          <Link
            href="/#offer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--ink)] px-4 text-sm font-semibold text-[var(--canvas)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]"
          >
            See the offer
            <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
          </Link>
        </div>
      </header>
      <main id="main-content" className="min-h-screen bg-[var(--canvas)] pt-[4.5rem]">
        <IndividualSearchGuide />
      </main>
      <Footer />
    </>
  );
}
