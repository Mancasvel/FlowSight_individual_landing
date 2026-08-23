"use client";

import { List, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FlowSightRelease } from "@/lib/releases";
import { siteConfig } from "@/lib/site";
import { SmartDownload } from "./download-experience";

const navItems = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
  { href: "#plans", label: "Plans" },
] as const;

export function Navigation({ release }: { release: FlowSightRelease }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[color:var(--header)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-[88rem] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label="FlowSight Individual home"
          className="flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]"
        >
          <Image src="/flowsight-icon-180.png" alt="" width={28} height={28} className="h-7 w-7" priority />
          <span className="font-heading text-lg font-semibold tracking-[-0.035em] text-[var(--ink)]">FlowSight</span>
          <span className="hidden border-l border-[var(--line-strong)] pl-2.5 text-xs font-semibold text-[var(--muted)] sm:inline">Individual</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-md py-2 transition-colors hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={siteConfig.teamsUrl} className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]">
            For teams
          </a>
          <SmartDownload release={release} compact />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" weight="bold" aria-hidden /> : <List className="h-5 w-5" weight="bold" aria-hidden />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="motion-menu border-t border-[var(--line)] bg-[var(--canvas)] px-5 pb-5 pt-3 shadow-[0_20px_45px_rgba(2,23,28,0.08)] lg:hidden"
          >
            <nav className="mx-auto grid max-w-[88rem] gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-soft)]">
                  {item.label}
                </a>
              ))}
              <a href={siteConfig.teamsUrl} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-soft)]">For teams</a>
              <SmartDownload release={release} className="mt-2 w-full" />
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
