import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { getPaidPurchaseSession } from "@/lib/individual-purchase.server";
import { ensureIndividualLicense } from "@/lib/individual-license.server";
import { configuredPurchaseAssets, isIndividualSessionId, type PurchaseAsset } from "@/lib/individual-purchase";
import styles from "./success.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your FlowSight Individual download",
  description: "Return to your official FlowSight Individual installers after a verified purchase.",
  robots: { index: false, follow: false },
  other: { referrer: "no-referrer" },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function PurchaseSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;
  let paid = false;
  let verificationError = false;
  let deliveryError = false;
  let licenseCode: string | null = null;

  if (isIndividualSessionId(sessionId)) {
    try {
      const session = await getPaidPurchaseSession(sessionId);
      paid = Boolean(session);
      if (session) {
        try {
          licenseCode = await ensureIndividualLicense(session);
        } catch (error) {
          console.error("Individual license delivery unavailable:", error);
          deliveryError = true;
        }
      }
    } catch (error) {
      console.error("Purchase verification unavailable:", error);
      verificationError = true;
    }
  }

  let assets: PurchaseAsset[] = [];
  if (paid) {
    try {
      assets = configuredPurchaseAssets();
      deliveryError = assets.length === 0;
    } catch (error) {
      console.error("Purchase delivery configuration unavailable:", error);
      deliveryError = true;
    }
  }
  const canDownload = paid && Boolean(licenseCode) && assets.length > 0;

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#purchase-content">Skip to content</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="FlowSight Individual home">
          <Image src="/flowsight-icon-180.png" alt="" width={32} height={32} priority />
          <span>FlowSight <span className={styles.brandQualifier}>/ Individual</span></span>
        </Link>
        <a href="mailto:manuel@flowsight.site?subject=FlowSight%20Individual%20purchase%20help" className={styles.supportLink}>Need help? <ArrowUpRight size={16} aria-hidden /></a>
      </header>

      <main id="purchase-content" className={styles.main}>
        <div className={styles.statusIcon} aria-hidden="true">
          {canDownload ? <CheckCircle size={34} weight="duotone" /> : <WarningCircle size={34} weight="duotone" />}
        </div>
        {canDownload ? (
          <>
            <h1>Your download is ready.</h1>
            <p className={styles.intro}>Your FlowSight Individual purchase is verified. Your license covers one active Windows computer, one Mac and one Linux computer. Choose the installer for this computer; your work data stays local.</p>
            <p className={styles.note}>Your local-edition license code: <strong>{licenseCode}</strong>. Keep it private. After installing, open Settings → Individual local license and enter it there. This is separate from the Individual Pro cloud license.</p>
            <div className={styles.downloads} aria-label="Available installers">
              {assets.map((asset) => (
                <a
                  key={asset.id}
                  href={`/api/purchase/download?session_id=${encodeURIComponent(sessionId!)}&platform=${encodeURIComponent(asset.id)}`}
                  referrerPolicy="no-referrer"
                >
                  <span><strong>{asset.label}</strong><small>{asset.filename}</small></span>
                  <ArrowDown size={20} weight="bold" aria-hidden />
                </a>
              ))}
            </div>
            <p className={styles.note}>Save this page and your Stripe receipt. You can <Link href="/purchase/recover">recover your purchase</Link> using the invoice number and buyer email, or <Link href="/install">download again with your license code</Link>. If a download fails, retry or contact support. Optional monthly cloud plans are separate.</p>
          </>
        ) : (
          <>
            <h1>We cannot show the download yet.</h1>
            <p className={styles.intro}>
              {verificationError
                ? "Purchase verification is temporarily unavailable. No new payment is needed. Please retry in a moment."
                : deliveryError
                  ? "Your payment is confirmed, but the license or installers are temporarily unavailable. Please contact support. Do not pay again."
                : isIndividualSessionId(sessionId)
                  ? "We could not confirm an active paid purchase from this link. If you just paid, allow a moment for payment confirmation and retry."
                  : "Open the private link in your purchase email to reach your installers."}
            </p>
            {isIndividualSessionId(sessionId) && <a className={styles.retry} href={`/purchase/success?session_id=${encodeURIComponent(sessionId)}`}>Check again</a>}
            <p className={styles.note}>If the problem continues, contact <a href="mailto:manuel@flowsight.site?subject=FlowSight%20Individual%20purchase%20help">manuel@flowsight.site</a>. Do not pay a second time.</p>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <span>FlowSight Individual</span>
        <a href="https://github.com/Mancasvel/FlowSight.AI" target="_blank" rel="noopener noreferrer">AGPL source code <ArrowUpRight size={15} aria-hidden /></a>
      </footer>
    </div>
  );
}
