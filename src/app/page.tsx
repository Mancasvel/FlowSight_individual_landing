import type { Metadata } from "next";
import IndividualOfferPage from "./offer-preview/page";
import { INDIVIDUAL_PRICE_EUROS, isIndividualCheckoutConfigured } from "@/lib/individual-purchase";
import { absoluteUrl, siteConfig } from "@/lib/site";
import summaryCapture from "../../public/product/flowsight-summary.png";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const checkoutOpen = isIndividualCheckoutConfigured();
  return {
    title: checkoutOpen
      ? "FlowSight Individual — €20 total once, local updates included"
      : "FlowSight Individual — €20 one-time offer",
    description: checkoutOpen
      ? "See where your day went with private, local-first AI. One €20 payment covers the official Windows, macOS and Linux installers, with local updates included."
      : "Explore the real FlowSight Individual app. One €20 payment will cover Windows, macOS and Linux, with local updates included; checkout is not open yet.",
    alternates: { canonical: absoluteUrl("/") },
  };
}

export default function Home() {
  const checkoutOpen = isIndividualCheckoutConfigured();
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
        ...(checkoutOpen ? { offers: { "@type": "Offer", name: "Official local installer for companies and self-employed professionals", price: String(INDIVIDUAL_PRICE_EUROS), priceCurrency: "EUR", url: absoluteUrl("/#offer") } } : {}),
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
