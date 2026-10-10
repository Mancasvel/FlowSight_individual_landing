import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const privateHeaders = [
      { key: "Cache-Control", value: "private, no-store" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];
    return [
      "/purchase/:path*",
      "/organizations/purchase/:path*",
      "/organizations/dashboard",
      "/api/organizations/purchase/:path*",
      "/install",
    ].map((source) => ({ source, headers: privateHeaders }));
  },
};

export default nextConfig;
