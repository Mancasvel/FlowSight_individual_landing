import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FlowSight Individual",
    short_name: "FlowSight",
    description: "Private work intelligence that runs on your device.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcfb",
    theme_color: "#008f84",
    icons: [
      { src: "/flowsight-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/flowsight-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
