import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DownloadCenter, SmartDownload } from "@/components/download-experience";
import { Footer } from "@/components/footer";
import { HeroProduct } from "@/components/hero-product";
import {
  ClosingDownload,
  HowItWorks,
  IndividualOutcomes,
  Plans,
  PrivacySection,
} from "@/components/landing-sections";
import { Navigation } from "@/components/navigation";
import { SupportedBy } from "@/components/supported-by";
import { getLatestRelease } from "@/lib/releases.server";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 3600;

export default async function Home() {
  const release = await getLatestRelease();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FlowSight Individual",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows 10, Windows 11, macOS 13+, Linux",
    url: absoluteUrl("/"),
    description: siteConfig.description,
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "EUR" },
      { "@type": "Offer", name: "Individual Pro", price: "12", priceCurrency: "EUR" },
    ],
  };

  return (
    <div className="landing-surface min-h-[100dvh] bg-[var(--canvas)] text-[var(--ink)]">
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-xl bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--canvas)] opacity-0 transition-[transform,opacity] focus-visible:translate-y-0 focus-visible:opacity-100">
        Skip to content
      </a>

      <Navigation release={release} />

      <main id="main-content">
        <section className="relative isolate flex min-h-[100dvh] items-center overflow-hidden px-5 pb-14 pt-24 sm:px-8 lg:pb-16">
          <div className="hero-grid-mask pointer-events-none absolute inset-0 -z-10" aria-hidden />
          <div className="mx-auto grid w-full max-w-[88rem] items-center gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16 xl:gap-24">
            <div className="max-w-[40rem]">
              <p className="eyebrow">FlowSight for individuals</p>
              <h1 className="mt-5 max-w-[15ch] text-balance font-heading text-[clamp(2.6rem,5vw,4.5rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[var(--ink)]">
                <span className="block">See your work.</span>
                <span className="block">Own your focus.</span>
              </h1>
              <p className="mt-6 max-w-[35rem] text-pretty text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                Private work intelligence that turns your day into focus patterns, clear summaries, and proof you can use.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SmartDownload release={release} className="w-full sm:w-auto" />
                <a href="#product" className="button-press inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-3 text-[15px] font-semibold text-[var(--ink)] transition-[transform,background-color,border-color] duration-150 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)] sm:w-auto">
                  See the product <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
                </a>
              </div>
            </div>

            <HeroProduct />
          </div>
        </section>

        <SupportedBy />
        <DownloadCenter release={release} />
        <IndividualOutcomes />
        <HowItWorks />
        <PrivacySection />
        <Plans release={release} />
        <ClosingDownload release={release} />
      </main>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </div>
  );
}
