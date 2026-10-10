import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, DownloadSimple, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import base from "../purchase/success/success.module.css";
import styles from "./install.module.css";

export const metadata: Metadata = {
  title: "Install FlowSight Solo with a license code",
  description: "Enter your FlowSight Solo local license code to download the official installer.",
  robots: { index: false, follow: false },
  other: { referrer: "no-referrer" },
};

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function InstallPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <div className={base.page}>
      <a className={base.skipLink} href="#install-content">Skip to content</a>
      <header className={base.header}>
        <Link href="/" className={base.brand} aria-label="FlowSight Individual home">
          <Image src="/flowsight-icon-180.png" alt="" width={32} height={32} priority />
          <span>FlowSight <span className={base.brandQualifier}>/ Solo</span></span>
        </Link>
      </header>
      <main id="install-content" className={base.main}>
        <div className={base.statusIcon} aria-hidden="true"><DownloadSimple size={34} weight="duotone" /></div>
        <h1>Install with your code.</h1>
        <p className={base.intro}>Enter the local license code from your FlowSight purchase to download the official installer. Your focus analysis and personal summary stay in your app.</p>
        {(error === "invalid" || error === "unavailable") && (
          <p className={styles.error} role="alert"><WarningCircle size={20} aria-hidden />
            {error === "invalid"
              ? "We could not verify that code and platform. Check the code with your organizer or contact support."
              : "The installer is temporarily unavailable. Please try again later; do not buy another license."}
          </p>
        )}
        <form className={styles.form} action="/api/install/download" method="post">
          <div className={styles.field}>
            <label htmlFor="licenseCode">Your license code</label>
            <input id="licenseCode" name="licenseCode" type="password" autoComplete="off" required maxLength={64} placeholder="FSI-…" />
            <small>Use the code assigned to you. Do not use your organizer&apos;s private purchase link.</small>
          </div>
          <div className={styles.field}>
            <label htmlFor="platform">Choose an installer</label>
            <select id="platform" name="platform" required defaultValue="">
              <option value="" disabled>Select your computer</option>
              <option value="windows">Windows</option>
              <option value="mac-arm">macOS · Apple Silicon</option>
              <option value="mac-intel">macOS · Intel</option>
              <option value="linux-deb">Linux · .deb</option>
              <option value="linux-appimage">Linux · AppImage</option>
            </select>
          </div>
          <button type="submit">Download installer <ArrowRight size={18} weight="bold" aria-hidden /></button>
        </form>
        <p className={base.note}>Each code permits one active computer per operating system. After installation, enter the same code in Settings → Individual local license. Cloud subscriptions are separate. Need help? Email <a href="mailto:manuel@flowsight.site?subject=FlowSight%20Solo%20installation%20help">manuel@flowsight.site</a>.</p>
      </main>
    </div>
  );
}
