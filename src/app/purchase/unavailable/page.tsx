import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import styles from "../success/success.module.css";

export const metadata: Metadata = {
  title: "FlowSight Individual checkout unavailable",
  robots: { index: false, follow: false },
};

export default function CheckoutUnavailablePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="FlowSight Individual home">
          <Image src="/flowsight-icon-180.png" alt="" width={32} height={32} priority />
          <span>FlowSight <span className={styles.brandQualifier}>/ Individual</span></span>
        </Link>
      </header>
      <main className={styles.main}>
        <div className={styles.statusIcon} aria-hidden="true"><WarningCircle size={34} weight="duotone" /></div>
        <h1>Checkout is temporarily unavailable.</h1>
        <p className={styles.intro}>No payment was taken. Please try again later or contact support if the problem continues.</p>
        <Link className={styles.retry} href="/#offer">Back to the offer</Link>
        <p className={styles.note}>Need help? Email <a href="mailto:manuel@flowsight.site?subject=FlowSight%20Individual%20checkout%20help">manuel@flowsight.site</a>.</p>
      </main>
    </div>
  );
}
