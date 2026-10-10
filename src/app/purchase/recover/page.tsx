import type { Metadata } from "next";
import Link from "next/link";
import styles from "../success/success.module.css";
import formStyles from "./recover.module.css";

export const metadata: Metadata = { title: "Recover your FlowSight purchase", robots: { index: false, follow: false } };

export default async function RecoverPurchasePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <div className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.brand}>FlowSight / Individual</Link></header>
    <main className={styles.main}>
      <h1>Return to your purchase.</h1>
      <p className={styles.intro}>Enter the invoice number and email address from your Stripe purchase receipt to reopen your license and official installers.</p>
      {error && <p className={styles.note} role="alert">We could not verify those details. Use the exact invoice number and buyer email from your receipt, or contact support.</p>}
      <form action="/api/purchase/recover" method="post" className={formStyles.form}>
        <label htmlFor="invoiceNumber">Invoice number</label>
        <input id="invoiceNumber" name="invoiceNumber" required maxLength={64} autoComplete="off" />
        <label htmlFor="email">Purchase email</label>
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
        <button type="submit" className={styles.retry}>Open my purchase</button>
      </form>
      <p className={styles.note}>Keep your receipt private. Need help? <a href="mailto:manuel@flowsight.site">manuel@flowsight.site</a></p>
    </main>
  </div>;
}
