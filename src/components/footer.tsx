import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

const links = [
  { label: "For teams", href: siteConfig.teamsUrl },
  { label: "GitHub", href: "https://github.com/Mancasvel/FlowSight.AI" },
  { label: "Security", href: `${siteConfig.companyUrl}/security` },
  { label: "Privacy", href: `${siteConfig.companyUrl}/privacy-policy` },
  { label: "Support", href: `${siteConfig.companyUrl}/support` },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface-soft)] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[82rem] flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]">
            <Image src="/flowsight-icon-180.png" alt="" width={26} height={26} className="h-6.5 w-6.5" />
            <span className="font-heading font-semibold tracking-[-0.03em] text-[var(--ink)]">FlowSight Individual</span>
          </Link>
          <p className="mt-3 text-sm text-[var(--muted)]">Private work intelligence, built around the person doing the work.</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[var(--muted)]" aria-label="Footer navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="rounded-md py-2 transition-colors hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]">
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-9 max-w-[82rem] border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} FlowSight Inc. All rights reserved.
      </div>
    </footer>
  );
}
