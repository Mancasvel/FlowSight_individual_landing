import Image from "next/image";

const partners = [
  { name: "Xiji Incubator", src: "/logos/logo-xiji-incubator-transparent.png", width: 128, height: 60 },
  { name: "University of Seville", src: "/logos/University-of-Seville-980x999.png", width: 48, height: 48 },
  { name: "Barner", src: "/logos/barner_logo_mobile.svg", width: 132, height: 58 },
  { name: "MongoDB", src: "/logos/mongodb.svg", width: 38, height: 38 },
  { name: "Microsoft", src: "/logos/microsoft.svg", width: 34, height: 34 },
  { name: "Xiaomi", src: "/logos/xiaomi.svg", width: 112, height: 54 },
] as const;

export function SupportedBy() {
  return (
    <section aria-labelledby="supported-heading" className="border-y border-[var(--line)] bg-[var(--surface)] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-[82rem]">
        <h2 id="supported-heading" className="text-center text-sm font-semibold text-[var(--muted)]">Supported by</h2>
        <div className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div key={partner.name} className="flex h-14 items-center justify-center opacity-65 grayscale transition-[filter,opacity] duration-200 hover:opacity-100 hover:grayscale-0">
              <Image src={partner.src} alt={partner.name} width={partner.width} height={partner.height} className="partner-logo h-auto max-h-12 w-auto max-w-[8rem] object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
