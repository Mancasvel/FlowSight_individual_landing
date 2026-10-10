import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, GithubLogo, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { INDIVIDUAL_PRICE_EUROS, isIndividualCheckoutConfigured } from "@/lib/individual-purchase";
import { SupportedBy } from "@/components/supported-by";
import { siteConfig } from "@/lib/site";
import summaryCapture from "../../../public/product/flowsight-summary.png";
import todayCapture from "../../../public/product/flowsight-today.png";
import styles from "./preview.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FlowSight Individual — €20 one-time offer",
  description: "See the real FlowSight Individual app and its €20 one-time official installer offer.",
  robots: { index: false, follow: false },
};

const sourceUrl = "https://github.com/Mancasvel/FlowSight.AI";
const launchEmail = "mailto:manuel@flowsight.site?subject=FlowSight%20Individual%20%E2%82%AC20%20offer";

export default function OfferPreview() {
  const checkoutOpen = isIndividualCheckoutConfigured();
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to content</a>
      <aside className={styles.previewNotice} aria-label="Offer availability">
        {checkoutOpen
          ? <>One €20 payment covers Windows, macOS and Linux <span aria-hidden="true">·</span> local updates included</>
          : <>One €20 payment will cover Windows, macOS and Linux <span aria-hidden="true">·</span> checkout not open yet</>}
      </aside>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="FlowSight Individual home">
            <Image src="/flowsight-icon-180.png" alt="" width={32} height={32} priority />
            <span>FlowSight<span className={styles.brandQualifier}> / Individual</span></span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            <a href="#product">The product</a>
            <a href="#how-it-works">How it works</a>
            <a href="#open-source">Open source</a>
          </nav>
          <a className={styles.headerAction} href="#offer">See the offer <ArrowUpRight size={16} weight="bold" aria-hidden /></a>
        </div>
      </header>

      <main id="content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 id="hero-title">See where your day went.<br /><em>Keep it yours.</em></h1>
              <p className={styles.heroDescription}>
                FlowSight turns everyday work into focus patterns and a clear summary. The sensitive context stays on your device. The official app is available to companies and self-employed professionals.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#offer">See the €20 one-time offer <ArrowRight size={19} weight="bold" aria-hidden /></a>
                <a className={styles.textAction} href="#product">See the real app <ArrowDown size={18} weight="bold" aria-hidden /></a>
              </div>
            </div>

            <div className={styles.heroVisual} aria-label="Real FlowSight application capture">
              <div className={styles.heroVisualTopline}><span>FLOWSIGHT / INSIGHTS</span><span>PRODUCT CAPTURE · EXAMPLE DATA</span></div>
              <div className={styles.heroImageWrap}>
                <Image
                  src={summaryCapture}
                  alt="Actual FlowSight Insights view showing a daily focus total, work categories, and deep-focus highlights with example data"
                  width={460}
                  height={920}
                  sizes="(max-width: 720px) 85vw, (max-width: 1100px) 42vw, 430px"
                  priority
                  className={styles.heroImage}
                />
              </div>
              <div className={styles.heroVisualBottomline}><span>Understand the pattern.</span><span>Without exposing the details.</span></div>
            </div>
          </div>
        </section>

        <div className={styles.signalBar} aria-label="FlowSight at a glance">
          <span>Real work, not keystroke scores</span><span className={styles.signalDot} aria-hidden="true" />
          <span>Local-first analysis</span><span className={styles.signalDot} aria-hidden="true" />
          <span>Open source</span>
        </div>
        <SupportedBy />

        <section id="product" className={styles.productSection} aria-labelledby="product-title">
          <div className={styles.sectionIntro}>
            <h2 id="product-title">A useful picture of the day, not another dashboard to babysit.</h2>
            <p>Start your day, do the work, and return to a summary you can actually use. The screens below are captures of FlowSight, with example data.</p>
          </div>

          <div className={styles.productStory}>
            <div className={styles.todayPanel}>
              <div className={styles.panelText}>
                <span className={styles.panelNumber}>01 / TODAY</span>
                <h3>Set a goal.<br />Then get on with it.</h3>
                <p>Keep a simple daily target in view while FlowSight works quietly in the background.</p>
              </div>
              <Image src={todayCapture} alt="Actual FlowSight Today screen with a daily focus goal and current-task controls, showing example data" width={460} height={920} sizes="(max-width: 720px) 80vw, 330px" className={styles.todayImage} />
            </div>
            <div className={styles.summaryPanel}>
              <div className={styles.panelText}>
                <span className={styles.panelNumber}>02 / INSIGHTS</span>
                <h3>See the shape<br />of your work.</h3>
                <p>Focus time, work categories, and highlights make the day legible without reducing you to an activity score.</p>
              </div>
              <div className={styles.summaryCrop}>
                <Image src={summaryCapture} alt="Actual FlowSight Insights screen with example focus-time, category, and highlight data" width={460} height={920} sizes="(max-width: 720px) 80vw, 330px" className={styles.summaryImage} />
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.mechanismSection} aria-labelledby="mechanism-title">
          <div className={styles.mechanismInner}>
            <div className={styles.mechanismTitle}>
              <h2 id="mechanism-title">The intelligence is local. So is the control.</h2>
              <p>FlowSight uses its bundled local model to make sense of sensitive screen context on your machine. Cloud features are optional and separate from local mode.</p>
            </div>
            <ol className={styles.mechanismList}>
              <li><span>01</span><strong>Work as usual</strong><p>The desktop agent runs alongside your normal apps.</p></li>
              <li><span>02</span><strong>Understand locally</strong><p>Sensitive context is processed on the device, not sent away for basic analysis.</p></li>
              <li><span>03</span><strong>Review your day</strong><p>See focus blocks, work categories, and a personal summary.</p></li>
            </ol>
          </div>
        </section>

        <section id="open-source" className={styles.opensourceSection} aria-labelledby="opensource-title">
          <div className={styles.opensourceInner}>
            <div className={styles.opensourceIcon}><GithubLogo size={32} weight="fill" aria-hidden /></div>
            <div>
              <h2 id="opensource-title">Open source is a promise, not a footnote.</h2>
              <p>The FlowSight source stays public under AGPL-3.0: you can use, modify, build, and redistribute it under that license. The €20 offer covers the official installer and local updates, not exclusive rights to the code. Existing users will keep their local updates without paying again. Previously published installers remain available during the transition.</p>
              <div className={styles.opensourceLinks}>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Explore the source <ArrowUpRight size={18} weight="bold" aria-hidden /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="offer" className={styles.offerSection} aria-labelledby="offer-title">
          <span id="download" className={styles.legacyDownloadAnchor} aria-hidden="true" />
          <div className={styles.offerInner}>
            <div className={styles.offerCopy}>
              <h2 id="offer-title">For your business.<br />€{INDIVIDUAL_PRICE_EUROS}, once.</h2>
              <p>Buy FlowSight Individual for your company or self-employed work, in any country. One €{INDIVIDUAL_PRICE_EUROS} payment, including applicable tax, includes the official installers and one active computer for each of Windows, macOS and Linux. Local updates are included.</p>
              <p>Business purchases only. You will need your legal business name, fiscal or registration ID and billing address. Consumer purchases are not available, including purchases from abroad.</p>
              <div className={styles.offerTrust}><ShieldCheck size={21} weight="duotone" aria-hidden /> Raw screen context stays on your device in local mode.</div>
            </div>
            <div className={styles.priceCard}>
              <div className={styles.priceCardTop}><span>FLOWSIGHT INDIVIDUAL</span><span>ONE-TIME PURCHASE</span></div>
              <div className={styles.price}><span>€</span>{INDIVIDUAL_PRICE_EUROS}</div>
              <p className={styles.paymentCadence}>One payment. One computer per operating system. Local updates included.</p>
              <p className={styles.priceNote}>
                {checkoutOpen
                  ? <>€20 is the total including applicable tax. Stripe shows the final total before payment. Existing users keep local updates.</>
                  : <>€{INDIVIDUAL_PRICE_EUROS} total, including applicable tax. Online purchasing is not available yet. Contact us about availability. Existing users keep local updates.</>}
              </p>
              {checkoutOpen ? (
                <form action="/api/purchase/checkout" method="post">
                  <div className={styles.businessFields}>
                    <label htmlFor="businessName">Legal business name</label>
                    <input id="businessName" name="businessName" autoComplete="organization" required minLength={2} maxLength={150} />
                    <label htmlFor="businessTaxId">Fiscal or business registration ID</label>
                    <input id="businessTaxId" name="businessTaxId" required minLength={3} maxLength={64} aria-describedby="business-hint" />
                    <p id="business-hint">Use your company or self-employed registration details. Confirm them with your billing address in Stripe.</p>
                  </div>
                  <label className={styles.businessDeclaration}>
                    <input name="businessDeclared" type="checkbox" value="true" required />
                    <span>I represent a company or work as a self-employed professional, and I am buying for professional use.</span>
                  </label>
                  <button className={styles.offerAction} type="submit">Buy the official installer for €20 total <ArrowRight size={18} weight="bold" aria-hidden /></button>
                </form>
              ) : (
                <a className={styles.offerAction} href={launchEmail}>Ask about the €20 offer <ArrowUpRight size={18} weight="bold" aria-hidden /></a>
              )}
              <p className={styles.offerEmail}>{checkoutOpen ? "Questions?" : "Contact us at"} <a href="mailto:manuel@flowsight.site">manuel@flowsight.site</a></p>
              <div className={styles.priceDivider} />
              <p className={styles.currentHeading}>THE LOCAL EDITION INCLUDES</p>
              <ul>
                <li>Local AI and personal work summaries</li>
                <li>Local updates included</li>
                <li>One active computer per operating system</li>
                <li>No account required for local use</li>
                <li>AGPL-3.0 source remains available</li>
              </ul>
              <p className={styles.priceExclusion}>Individual Pro remains €12/month. Other monthly plans are unchanged. Optional cloud services are not included in this one-time purchase.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div><strong>FlowSight Individual</strong><p>See your work. Keep your privacy.</p></div>
          <nav aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Source code</a>
            <a href={`${siteConfig.companyUrl}/privacy-policy`}>Privacy</a>
            <a href={`${siteConfig.companyUrl}/support`}>Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
