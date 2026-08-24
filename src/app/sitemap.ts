import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/guides/private-productivity-tracker"),
      lastModified: "2026-08-24",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
