import type { Metadata } from "next";
import IndividualOfferPage from "./offer-preview/page";
import { isSoloOfferCheckoutConfigured } from "@/lib/solo-offer";
import { absoluteUrl, siteConfig } from "@/lib/site";
import summaryCapture from "../../public/product/flowsight-summary.png";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const checkoutOpen = isSoloOfferCheckoutConfigured();
  return {
    title: checkoutOpen
      ? "FlowSight Solo | Local AI. €25 once."
      : "FlowSight Solo | Understand your work with local AI",
    description: checkoutOpen
      ? "See where your day went with private, local-first AI. One €25 payment covers the official Windows, macOS and Linux installers, with local updates included."
      : "Understand your work with private local AI, focus insights and daily summaries. Explore the app and the planned €25 one-time edition for Windows, macOS and Linux.",
    alternates: { canonical: absoluteUrl("/") },
  };
}

export default function Home() {
  const checkoutOpen = isSoloOfferCheckoutConfigured();
  const organizationId = `${siteConfig.companyUrl}/#organization`;
  const applicationId = absoluteUrl("/#software");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": organizationId,
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.companyUrl,
        sameAs: siteConfig.sameAs,
      },
      {
        "@id": absoluteUrl("/#website"),
        "@type": "WebSite",
        name: "FlowSight Individual",
        url: absoluteUrl("/"),
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
      {
        "@id": absoluteUrl("/#app-guide-video"),
        "@type": "VideoObject",
        name: "FlowSight Complete App Guide",
        description: "A tour of FlowSight: task tracking, Pomodoro, local AI planning, Total Focus, Insights, reports, optional Cloud, MCP and privacy controls.",
        thumbnailUrl: absoluteUrl("/product/flowsight-complete-guide.jpg"),
        contentUrl: "https://mancasvel.github.io/flowsight-guides/assets/complete-guide/FlowSight-Complete-Guide-EN.mp4?v=17d537e84be9",
        uploadDate: "2026-10-11T14:49:27Z",
        duration: "PT1M30S",
        inLanguage: "en",
        creator: { "@type": "Person", name: "Manuel Castillejo" },
        publisher: { "@id": organizationId },
      },
      {
        "@id": applicationId,
        "@type": "SoftwareApplication",
        name: "FlowSight Individual",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Personal productivity and focus analytics",
        operatingSystem: ["Windows", "macOS", "Linux"],
        url: absoluteUrl("/"),
        description: siteConfig.description,
        screenshot: absoluteUrl(summaryCapture.src),
        featureList: ["Local-first activity analysis", "Deep-focus detection", "Daily work summaries"],
        publisher: { "@id": organizationId },
        ...(checkoutOpen ? { offers: { "@type": "Offer", name: "Official local installer", price: "25", priceCurrency: "EUR", url: absoluteUrl("/#offer") } } : {}),
      },
    ],
  };

  return (
    <>
      <IndividualOfferPage />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
