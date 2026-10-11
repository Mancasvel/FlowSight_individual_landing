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
