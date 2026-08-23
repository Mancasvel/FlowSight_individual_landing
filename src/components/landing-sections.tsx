"use client";

import {
  ArrowRight,
  ArrowsClockwise,
  ChartLineUp,
  Check,
  CloudArrowUp,
  Cpu,
  Crosshair,
  FileText,
  Monitor,
  ShieldCheck,
} from "@phosphor-icons/react";
import type { FlowSightRelease } from "@/lib/releases";
import { individualPurchaseUrl, siteConfig } from "@/lib/site";
import { SmartDownload } from "./download-experience";
import { Reveal } from "./motion-primitives";

const outcomes = [
  {
    title: "Protect deep work.",
    body: "See sustained focus blocks and the moments that quietly break them apart.",
    icon: Crosshair,
    className: "bg-[var(--accent-soft)] lg:col-span-7",
  },
  {
    title: "Catch fragmentation early.",
    body: "Understand when app switching and interruptions start shaping the day.",
    icon: ArrowsClockwise,
    className: "bg-[var(--surface)] lg:col-span-5",
  },
  {
    title: "Leave with a record.",
    body: "Turn scattered activity into a readable summary of what moved forward.",
    icon: FileText,
    className: "bg-[#071419] text-[#f4fffd] lg:col-span-5",
    dark: true,
  },
  {
    title: "Use insight, not pressure.",
    body: "FlowSight helps you adjust your own work. It does not score how hard you typed.",
    icon: ShieldCheck,
    className: "fine-grid bg-[var(--surface-soft)] lg:col-span-7",
  },
] as const;

export function IndividualOutcomes() {
  return (
    <section id="product" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[82rem]">
        <Reveal>
          <h2 className="max-w-[15ch] text-balance font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl lg:text-6xl">
            Built for one person doing real work.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
            Useful enough to change tomorrow, private enough to trust every day.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {outcomes.map((outcome, index) => {
            const Icon = outcome.icon;
            const isDark = "dark" in outcome && outcome.dark;
            return (
              <Reveal key={outcome.title} className={outcome.className} delay={index * 0.045}>
                <article className="flex min-h-[17rem] flex-col justify-between rounded-2xl border border-[var(--line)] p-7 sm:p-9">
                  <Icon className={`h-7 w-7 ${isDark ? "text-[#5eead4]" : "text-[var(--accent-strong)]"}`} weight="duotone" aria-hidden />
                  <div className="mt-14 max-w-lg">
                    <h3 className={`font-heading text-2xl font-semibold tracking-[-0.03em] sm:text-3xl ${isDark ? "text-[#f4fffd]" : "text-[var(--ink)]"}`}>
                      {outcome.title}
                    </h3>
                    <p className={`mt-3 text-sm leading-6 sm:text-base ${isDark ? "text-slate-300" : "text-[var(--muted)]"}`}>
                      {outcome.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Start the agent",
    body: "Install FlowSight and choose your daily goal. Free local mode opens without an account.",
    icon: Monitor,
  },
  {
    title: "Work normally",
    body: "The bundled local model turns screen context into meaningful activity on your device.",
    icon: Cpu,
  },
  {
    title: "Review the pattern",
    body: "Use Today and Summary to see focus, categories, interruptions, and completed work.",
    icon: ChartLineUp,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--surface)] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[82rem]">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 max-w-[13ch] text-balance font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl lg:text-6xl">
            Set it up. Then forget it.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
            FlowSight stays quiet while you work and gives the day back in a form you can use.
          </p>
        </Reveal>

        <div className="mt-14 grid border-t border-[var(--line-strong)] md:grid-cols-[1.2fr_1fr_1fr]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} className="border-b border-[var(--line)] py-8 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0" delay={index * 0.055}>
                <Icon className="h-6 w-6 text-[var(--accent-strong)]" weight="duotone" aria-hidden />
                <h3 className="mt-8 font-heading text-xl font-semibold tracking-[-0.025em] text-[var(--ink)]">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">{step.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PrivacySection() {
  return (
    <section id="privacy" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-20">
        <Reveal>
          <ShieldCheck className="h-8 w-8 text-[var(--accent-strong)]" weight="duotone" aria-hidden />
          <h2 className="mt-7 max-w-[13ch] text-balance font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
            Your screen is not a team feed.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-[var(--muted)]">
            Sensitive context is analysed locally. Cloud features only receive selected data after you activate them.
          </p>
          <a href={`${siteConfig.companyUrl}/security`} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[var(--ink)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--accent-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]">
            Read about security <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
          </a>
        </Reveal>

        <Reveal className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 shadow-[0_24px_70px_rgba(14,45,48,0.08)]" delay={0.06}>
          <div className="fine-grid rounded-xl p-5 sm:p-8">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
              {[
                { label: "Screen context", note: "Private input", icon: Monitor },
                { label: "Local AI", note: "On-device analysis", icon: Cpu },
                { label: "Personal summary", note: "Yours to review", icon: FileText },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="contents">
                    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
                      <Icon className="h-6 w-6 text-[var(--accent-strong)]" weight="duotone" aria-hidden />
                      <p className="mt-8 font-heading text-base font-semibold text-[var(--ink)]">{item.label}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{item.note}</p>
                    </div>
                    {index < 2 ? <ArrowRight className="mx-auto hidden h-5 w-5 text-[var(--muted)] md:block" aria-hidden /> : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] p-5">
              <CloudArrowUp className="h-6 w-6 shrink-0 text-[var(--muted)]" weight="duotone" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">Cloud features are optional</p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Activate sync, integrations, or cloud AI only when you want them.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const freeFeatures = [
  "Local-first activity analysis",
  "Cognitive health tracking",
  "Deep-focus detection",
  "On-device pattern learning",
  "Inspectable core",
];

const proFeatures = [
  "Everything in Free",
  "150 AI coach prompts per month",
  "Personal weekly PDF digest",
  "90-day cloud history",
  "Priority support",
];

function FeatureList({ items, inverted = false }: { items: string[]; inverted?: boolean }) {
  return (
    <ul className="mt-8 space-y-3">
      {items.map((item) => (
        <li key={item} className={`flex gap-2.5 text-sm leading-5 ${inverted ? "text-slate-300" : "text-[var(--muted)]"}`}>
          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${inverted ? "text-[#5eead4]" : "text-[var(--accent-strong)]"}`} weight="bold" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Plans({ release }: { release: FlowSightRelease }) {
  return (
    <section id="plans" className="scroll-mt-24 border-y border-[var(--line)] bg-[var(--surface-soft)] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[82rem]">
        <Reveal>
          <h2 className="max-w-[13ch] text-balance font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl lg:text-6xl">
            Start free. Add cloud when useful.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
            The local product is complete enough to trust before you decide to connect anything.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="dark-grid rounded-2xl bg-[#071419] p-7 text-[#f4fffd] sm:p-10" delay={0.04}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em]">Free</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">The private local agent for understanding your own focus patterns.</p>
              </div>
              <p className="font-heading text-4xl font-semibold tracking-[-0.04em]">€0</p>
            </div>
            <FeatureList items={freeFeatures} inverted />
            <SmartDownload release={release} light className="mt-10 w-full sm:w-auto" />
          </Reveal>

          <Reveal className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 sm:p-10" delay={0.09}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-[var(--ink)]">Individual Pro</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">For AI coaching, a longer history, and a weekly digest.</p>
              </div>
              <div className="text-right text-[var(--ink)]">
                <p className="font-heading text-4xl font-semibold tracking-[-0.04em]">€12</p>
                <p className="mt-1 text-xs text-[var(--muted)]">per month</p>
              </div>
            </div>
            <FeatureList items={proFeatures} />
            <a href={individualPurchaseUrl()} className="button-press mt-10 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition-[transform,background-color,border-color] duration-150 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)] sm:w-auto">
              Explore Individual Pro <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ClosingDownload({ release }: { release: FlowSightRelease }) {
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-28">
      <Reveal className="closing-grid mx-auto max-w-[82rem] overflow-hidden rounded-2xl bg-[#5eead4] px-7 py-14 text-[#071316] sm:px-12 lg:px-16 lg:py-20">
        <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <h2 className="max-w-[16ch] text-balance font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Make your work visible to you.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#071316]">Download FlowSight and start in private local mode today.</p>
          </div>
          <SmartDownload release={release} light className="w-full sm:w-auto" />
        </div>
      </Reveal>
    </section>
  );
}
