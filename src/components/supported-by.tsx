import Image from "next/image";
import styles from "./supported-by.module.css";

const partners = [
  { name: "Xiji Incubator", src: "/logos/logo-xiji-incubator.jpg", width: 128, height: 60 },
  { name: "Universidad de Sevilla", src: "/logos/University-of-Seville-980x999.png", width: 44, height: 44, label: "Universidad de Sevilla" },
  { name: "Barner Brand", src: "/logos/barner_logo_mobile.svg", width: 132, height: 58 },
  { name: "MongoDB", src: "/logos/mongodb.svg", width: 34, height: 34, label: "MongoDB" },
  { name: "Microsoft", src: "/logos/microsoft.svg", width: 32, height: 32, label: "Microsoft" },
  { name: "Xiaomi", src: "/logos/xiaomi.svg", width: 112, height: 54 },
] as const;

export function SupportedBy() {
  return (
    <section aria-labelledby="supported-heading" className={styles.section}>
      <div className={styles.frame}>
        <h2 id="supported-heading" className={styles.heading}>Supported by</h2>
        <ul role="list" className={styles.partners}>
          {partners.map((partner) => (
            <li key={partner.name} className={styles.partner}>
              <Image
                src={partner.src}
                alt={"label" in partner ? "" : partner.name}
                width={partner.width}
                height={partner.height}
                className={`${styles.logo} ${partner.src.endsWith(".jpg") ? styles.opaqueLogo : ""}`}
                style={{ width: partner.width }}
              />
              {"label" in partner ? <span className={styles.label}>{partner.label}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
