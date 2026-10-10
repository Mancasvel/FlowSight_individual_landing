export const siteConfig = {
  name: "FlowSight",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://solo.flowsight.site").replace(/\/$/, ""),
  appUrl: (process.env.NEXT_PUBLIC_APP_URL || "https://app.flowsight.site").replace(/\/$/, ""),
  teamsUrl: "https://flowsight.site",
  companyUrl: (process.env.NEXT_PUBLIC_COMPANY_URL || "https://flowsight.site").replace(/\/$/, ""),
  description:
    "Understand deep work, context switches, and daily progress with private local AI. FlowSight Individual runs on your device without a cloud account.",
  keywords: [
    "FlowSight Individual",
    "private productivity app",
    "private focus tracker",
    "deep work tracker",
    "focus tracker app",
    "context switching tracker",
    "personal productivity analytics",
    "local AI productivity app",
    "on-device productivity tracker",
    "automatic work journal",
    "daily work summary app",
    "proof of work app",
    "developer productivity tracker",
    "time tracker alternative",
  ],
  sameAs: [
    "https://www.linkedin.com/company/flow-sight/",
    "https://github.com/Mancasvel/FlowSight.AI",
  ],
} as const;

export function absoluteUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${suffix}`;
}

export function individualPurchaseUrl(): string {
  return `${siteConfig.appUrl}/dashboard/pricing?plan=individual_pro`;
}
