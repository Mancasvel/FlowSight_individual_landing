import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, GithubLogo, LockSimple, Monitor, AppleLogo, LinuxLogo, Cpu, Cloud, Plus } from "@phosphor-icons/react/dist/ssr";
import { isSoloOfferCheckoutConfigured } from "@/lib/solo-offer";
import { siteConfig } from "@/lib/site";
import { ContextDemo, ProductExplorer } from "@/components/solo-demo";
import { ProductCapabilities } from "@/components/product-capabilities";
import styles from "./preview.module.css";

/* THESIS: Demonstrate private work intelligence through context.
 * OWN-WORLD: flowsight.site white technical grid, navy type and teal signals.
 * STORY: Explore context, inspect FlowSight 6.1.0, calendar plan and weekly report, connect by choice.
 * FIRST VIEWPORT: Large left-aligned promise and actions; interactive context diagram at right.
 * FORM: User-pinned reference overrides assigned index 6; seed cbb42e24. Code-led.
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
 * the verdict, DESIGN.md, and every shipping raster carrying its provenance.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "FlowSight Solo | Understand your work",
  description: "Private local AI, deep-focus insights and daily work summaries. Explore FlowSight Solo and the planned €25 one-time local edition.",
  robots: { index: false, follow: false },
};
const sourceUrl = "https://github.com/Mancasvel/FlowSight.AI";
const launchEmail = "mailto:manuel@flowsight.site?subject=FlowSight%20Solo%20%E2%82%AC25%20offer";
const comparisons = [
  { label: "Understand the activity", competitors: "App, website or timer-based tracking", solo: "Screen context analysed with local AI" },
  { label: "Make sense of the work", competitors: "Categories and dashboards vary by tool", solo: "Work categories, sustained focus and report insights" },
  { label: "Plan the next step", competitors: "Planning may need a separate tool", solo: "Local AI session plans and calendar blocks" },
  { label: "Protect your attention", competitors: "Focus controls depend on the product", solo: "Timers, Browser Controls and local reminders" },
  { label: "Choose your desktop", competitors: "Platform support varies", solo: "Windows, macOS and Linux" },
];

export default function OfferPreview() {
  const checkoutOpen = isSoloOfferCheckoutConfigured();
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#content">Skip to content</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand} aria-label="FlowSight Solo home">
            <Image src="/flowsight-icon-180.png" alt="" width={30} height={30} priority />
            <span>FlowSight<span className={styles.brandQualifier}>Solo</span></span>
          </Link>
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            <a href="#product">The app</a><a href="#features">Features</a><a href="#reports">Reports</a><a href="#difference">Why FlowSight</a>
          </nav>
          <a className={styles.headerAction} href="#offer">Get FlowSight <ArrowUpRight size={17} aria-hidden /></a>
        </div>
      </header>
      <main id="content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroText}>
            <h1 id="hero-title">Understand<br />your <span>work.</span></h1>
            <p className={styles.heroDescription}>You put the hours in. See what they add up to.</p>
            <p className={styles.heroDetail}>Plan your day, protect your focus and understand what moved forward. Local AI connects your activity to your next decision.</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#product">Explore the app <ArrowDown size={18} aria-hidden /></a>
              <a className={styles.textAction} href="#offer">€25, once <ArrowUpRight size={17} aria-hidden /></a>
            </div>
            <div className={styles.platforms} aria-label="For Windows, macOS and Linux"><Monitor size={17} aria-hidden /><AppleLogo size={18} aria-hidden /><LinuxLogo size={18} aria-hidden /><span>One local edition. Three platforms.</span></div>
            {!checkoutOpen && <p className={styles.availability}>Planned one-time offer. Checkout not open yet.</p>}
          </div>
          <ContextDemo />
        </section>
        <div className={styles.principles} aria-label="The FlowSight approach">
          <span><Cpu size={19} aria-hidden /> Intelligence on your device</span>
          <span><LockSimple size={19} aria-hidden /> No account for local use</span>
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer"><GithubLogo size={19} aria-hidden /> Open source, by design <ArrowUpRight size={14} aria-hidden /></a>
        </div>
        <section id="product" className={styles.productSection} aria-labelledby="product-title"><ProductExplorer /></section>
        <ProductCapabilities />
        <section id="difference" className={styles.comparisonSection} aria-labelledby="difference-title">
          <div className={styles.sectionIntro}>
            <h2 id="difference-title">More context.<br /><span>More ways forward.</span></h2>
            <p>Activity is the starting point. FlowSight brings local AI, planning, focus tools and reports together to help you understand your day and shape the next one.</p>
          </div>
          <div className={styles.comparisonWrap}>
            <table className={styles.comparison}>
              <caption className={styles.srOnly}>Common activity-tracking approaches compared with FlowSight Solo; competitor capabilities vary by product</caption>
              <thead><tr><td /><th scope="col">Competitors<span>Common approaches</span></th><th scope="col">FlowSight Solo<span>Context-aware intelligence</span></th></tr></thead>
              <tbody>{comparisons.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.competitors}</td><td><Check size={16} weight="bold" aria-hidden /><span>{row.solo}</span></td></tr>)}</tbody>
            </table>
          </div>
          <p className={styles.comparisonNote}>A comparison of common approaches, not every competing product. Features, plans and platform availability vary by tool.</p>
        </section>
        <section id="offer" className={styles.offerSection} aria-labelledby="offer-title">
          <span id="download" aria-hidden="true" />
          <div className={styles.offerCopy}>
            <h2 id="offer-title">More clarity.<br />One payment.</h2>
            <p>Your local edition brings together AI analysis, session planning, focus tools, work reports and private review decisions.</p>
            <ul className={styles.offerFeatures}>
              <li><Check size={17} aria-hidden /> Bundled local AI</li><li><Check size={17} aria-hidden /> Windows, macOS and Linux</li>
              <li><Check size={17} aria-hidden /> Local updates included</li><li><Check size={17} aria-hidden /> No account for local use</li>
            </ul>
          </div>
          <div className={styles.pricePanel}>
            <div className={styles.priceTitle}><span>FlowSight Solo</span><span>Local edition</span></div>
            <p className={styles.price}>€25<span>once</span></p>
            <p className={styles.priceDescription}>One payment. One computer per operating system. Local updates included.</p>
            <p className={styles.priceNote}>{checkoutOpen ? "€25 total, including applicable tax." : "€25 is the planned one-time price, including applicable tax. Checkout not open yet."}</p>
            {checkoutOpen ? <form action="/api/purchase/checkout" method="post">
              <div className={styles.businessFields}>
                <label htmlFor="businessName">Legal business name</label>
                <input id="businessName" name="businessName" autoComplete="organization" required minLength={2} maxLength={150} />
                <label htmlFor="businessTaxId">Fiscal or business registration ID</label>
                <input id="businessTaxId" name="businessTaxId" required minLength={3} maxLength={64} aria-describedby="business-hint" />
                <p id="business-hint">For companies and self-employed professionals, in any country. Confirm your business details and billing address in Stripe.</p>
              </div>
              <label className={styles.businessDeclaration}><input name="businessDeclared" type="checkbox" value="true" required /><span>I represent a company or work as a self-employed professional, and I am buying for professional use.</span></label>
              <button className={styles.offerAction} type="submit">Get FlowSight for €25 <ArrowUpRight size={19} aria-hidden /></button>
            </form> : <a className={styles.offerAction} href={launchEmail}>Ask about availability <ArrowUpRight size={19} aria-hidden /></a>}
            <p className={styles.existingUsers}>Already using FlowSight? You keep your local updates without paying again.</p>
          </div>
        </section>
        <aside className={styles.cloudNote} aria-label="Optional cloud plan">
          <Cloud size={25} aria-hidden />
          <div><h3>More help, when you want it.</h3><p>Individual Pro remains €12/month, with AI coaching, a personal weekly PDF digest and 90-day cloud history. Optional cloud services are separate from the one-time local edition.</p></div>
          <a href={`${siteConfig.appUrl}/dashboard/pricing?plan=individual_pro`}>Explore Pro <ArrowUpRight size={16} aria-hidden /></a>
        </aside>
        <section className={styles.faqSection} aria-labelledby="faq-title">
          <h2 id="faq-title">A few good questions.</h2>
          <div className={styles.faqList}>
            <details><summary>Does the AI need the cloud?<Plus size={20} aria-hidden /></summary><p>No. The local edition includes a model that analyses sensitive screen context on your device. Optional cloud services and connections to external AI are separate choices and can send selected data to those services.</p></details>
            <details><summary>What does the €25 cover?<Plus size={20} aria-hidden /></summary><p>The planned €25 total, including applicable tax, covers the official Windows, macOS and Linux installers, one active computer per operating system, and local updates. Monthly cloud plans are separate. {checkoutOpen ? "The final total is shown before payment." : "Checkout is not open yet; contact us for availability."}</p></details>
            <details><summary>What if I already use FlowSight?<Plus size={20} aria-hidden /></summary><p>Existing users, including historical purchasers, keep their local updates without paying again. Previously published installers remain available during the transition.</p></details>
            <details><summary>Can I build it from source?<Plus size={20} aria-hidden /></summary><p>Yes. The source stays public under AGPL-3.0. You can use, build, modify and redistribute it under that licence. The one-time offer is for the official distribution, not exclusive rights to the code. <a href={sourceUrl} target="_blank" rel="noopener noreferrer">View the repository.</a></p></details>
          </div>
        </section>
        <section className={styles.closing} aria-label="Explore the FlowSight offer"><p>Make your next day<br /><span>make more sense.</span></p><a className={styles.primaryAction} href="#offer">Find your focus <ArrowRight size={19} aria-hidden /></a></section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerBrand}><strong>FlowSight <span>Solo</span></strong><p>Work intelligence. For you.</p></div>
        <nav aria-label="Footer navigation"><a href={sourceUrl} target="_blank" rel="noopener noreferrer">Source code</a><a href={`${siteConfig.companyUrl}/privacy-policy`}>Privacy</a><a href={`${siteConfig.companyUrl}/support`}>Support</a><a href={siteConfig.teamsUrl}>For teams <ArrowUpRight size={13} aria-hidden /></a></nav>
        <span className={styles.footerLegal}>FlowSight Individual</span>
      </footer>
    </div>
  );
}
