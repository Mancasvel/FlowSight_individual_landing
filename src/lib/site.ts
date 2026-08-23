export const siteConfig = {
  name: "FlowSight",
  legalName: "FlowSight Inc.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://flowsight.site").replace(/\/$/, ""),
  appUrl: (process.env.NEXT_PUBLIC_APP_URL || "https://app.flowsight.site").replace(/\/$/, ""),
  teamsUrl: "https://flowsight.site",
  companyUrl: (process.env.NEXT_PUBLIC_COMPANY_URL || "https://flowsight.site").replace(/\/$/, ""),
  description:
    "Private work intelligence for individuals. Understand focus, context switches, and progress with local AI that runs on your device.",
} as const;

export function absoluteUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${suffix}`;
}

export function individualPurchaseUrl(): string {
  return `${siteConfig.appUrl}/dashboard/pricing?plan=individual_pro`;
}
