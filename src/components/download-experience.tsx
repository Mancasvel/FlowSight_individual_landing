"use client";

import {
  AppleLogo,
  ArrowRight,
  CheckCircle,
  DownloadSimple,
  LinuxLogo,
  WindowsLogo,
} from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import type { FlowSightRelease } from "@/lib/releases";
import { Reveal } from "./motion-primitives";

type Platform = "windows" | "macos" | "linux" | "unknown";

function detectPlatform(): Platform {
  const value = `${navigator.platform || ""} ${navigator.userAgent || ""}`.toLowerCase();
  if (value.includes("win")) return "windows";
  if (value.includes("mac") || value.includes("iphone") || value.includes("ipad")) return "macos";
  if (value.includes("linux") || value.includes("x11")) return "linux";
  return "unknown";
}

const subscribeToPlatform = () => () => undefined;
const serverPlatform = (): Platform => "unknown";

function beginDownload(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

type SmartDownloadProps = {
  release: FlowSightRelease;
  compact?: boolean;
  light?: boolean;
  className?: string;
};

export function SmartDownload({ release, compact = false, light = false, className = "" }: SmartDownloadProps) {
  const platform = useSyncExternalStore(subscribeToPlatform, detectPlatform, serverPlatform);

  const label =
    platform === "windows"
      ? "Download for Windows"
      : platform === "macos"
        ? "Choose macOS download"
        : platform === "linux"
          ? "Choose Linux download"
          : "Download FlowSight";

  const handleClick = () => {
    if (platform === "windows" && release.downloads.windowsExe) {
      beginDownload(release.downloads.windowsExe);
      return;
    }

    document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`button-press group inline-flex min-h-11 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-5 font-semibold transition-[transform,background-color,color,border-color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)] ${
        compact ? "text-sm" : "min-h-13 py-3 text-[15px]"
      } ${
        light
          ? "bg-[var(--button-light)] text-[#071316] hover:bg-[var(--accent-soft)]"
          : "bg-[var(--ink)] text-[var(--canvas)] hover:bg-[var(--accent-strong)]"
      } ${className}`}
    >
      <DownloadSimple className="h-4.5 w-4.5 transition-transform duration-150 group-hover:translate-y-0.5" weight="bold" aria-hidden />
      {label}
    </button>
  );
}

type DownloadLinkProps = {
  href: string | undefined;
  fallback: string;
  children: React.ReactNode;
  inverted?: boolean;
};

function DownloadLink({ href, fallback, children, inverted = false }: DownloadLinkProps) {
  const target = href || fallback;

  return (
    <a
      href={target}
      target={href ? undefined : "_blank"}
      rel={href ? undefined : "noreferrer"}
      className={`button-press inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-[transform,background-color,border-color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 ${
        inverted
          ? "bg-[#f7fffd] text-[#071316] hover:bg-[#dff8f4] focus-visible:outline-[#5eead4]"
          : "border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] focus-visible:outline-[var(--accent)]"
      }`}
    >
      <DownloadSimple className="h-4 w-4" weight="bold" aria-hidden />
      {children}
    </a>
  );
}

export function DownloadCenter({ release }: { release: FlowSightRelease }) {
  return (
    <section id="download" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[82rem]">
        <Reveal>
          <p className="eyebrow">Download</p>
          <h2 className="mt-4 max-w-[13ch] text-balance font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--ink)] sm:text-5xl lg:text-6xl">
            Choose your platform.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
            Start in Free local mode. No account, cloud connection, or subscription is required.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid gap-4 lg:grid-cols-12" delay={0.06}>
          <article className="dark-grid relative flex min-h-[27rem] flex-col overflow-hidden rounded-2xl bg-[#071419] p-7 text-[#f4fffd] sm:p-10 lg:col-span-7">
            <div className="relative flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#5eead4]">
                <WindowsLogo className="h-6 w-6" weight="fill" aria-hidden />
              </span>
              <span className="rounded-lg border border-white/12 bg-white/6 px-2.5 py-1 font-mono text-[11px] text-slate-300">
                v{release.versions.windows}
              </span>
            </div>

            <div className="relative mt-auto max-w-xl">
              <h3 className="font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">FlowSight for Windows</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">Windows 10 or 11, 64-bit. Includes the local AI runtime.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <DownloadLink href={release.downloads.windowsExe} fallback={release.releasePages.windows} inverted>
                  Download .exe
                </DownloadLink>
                {release.downloads.windowsMsi ? (
                  <a
                    href={release.downloads.windowsMsi}
                    className="button-press inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-[transform,background-color,border-color] duration-150 hover:border-white/40 hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#5eead4]"
                  >
                    MSI installer
                  </a>
                ) : null}
              </div>
            </div>
          </article>

          <div className="grid gap-4 lg:col-span-5">
            <article className="flex min-h-[13rem] flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--ink)]">
                  <AppleLogo className="h-5 w-5" weight="fill" aria-hidden />
                </span>
                <span className="font-mono text-[11px] text-[var(--muted)]">v{release.versions.mac}</span>
              </div>
              <div className="mt-6">
                <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-[var(--ink)]">macOS</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">macOS 13 or newer.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <DownloadLink href={release.downloads.macArm} fallback={release.releasePages.mac}>Apple Silicon</DownloadLink>
                  {release.downloads.macIntel ? (
                    <DownloadLink href={release.downloads.macIntel} fallback={release.releasePages.mac}>Intel</DownloadLink>
                  ) : null}
                </div>
              </div>
            </article>

            <article className="flex min-h-[13rem] flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--ink)]">
                  <LinuxLogo className="h-5 w-5" weight="fill" aria-hidden />
                </span>
                <span className="font-mono text-[11px] text-[var(--muted)]">v{release.versions.linux}</span>
              </div>
              <div className="mt-6">
                <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em] text-[var(--ink)]">Linux</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Ubuntu, Debian, Fedora, and compatible distributions.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {release.downloads.linuxDeb ? (
                    <DownloadLink href={release.downloads.linuxDeb} fallback={release.releasePages.linux}>Download .deb</DownloadLink>
                  ) : null}
                  {release.downloads.linuxAppImage ? (
                    <DownloadLink href={release.downloads.linuxAppImage} fallback={release.releasePages.linux}>AppImage</DownloadLink>
                  ) : null}
                  {!release.downloads.linuxDeb && !release.downloads.linuxAppImage ? (
                    <a
                      href={release.releasePages.linux}
                      target="_blank"
                      rel="noreferrer"
                      className="button-press inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--accent)]"
                    >
                      View release <ArrowRight className="h-4 w-4" weight="bold" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        </Reveal>

        <Reveal className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3" delay={0.1}>
          {["No account required", "Local AI included", "Free mode stays local"].map((item) => (
            <div key={item} className="flex min-h-16 items-center gap-3 bg-[var(--surface)] px-5 py-4 text-sm font-semibold text-[var(--ink)]">
              <CheckCircle className="h-5 w-5 shrink-0 text-[var(--accent-strong)]" weight="fill" aria-hidden />
              {item}
            </div>
          ))}
        </Reveal>

      </div>
    </section>
  );
}
