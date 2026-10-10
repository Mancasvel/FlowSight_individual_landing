import { NextRequest, NextResponse } from "next/server";

/** Commerce runs with the existing protected server credentials in Vercel. */
export function proxy(request: NextRequest) {
  const serviceUrl = process.env.INDIVIDUAL_PURCHASE_SERVICE_URL;
  const access = process.env.INDIVIDUAL_PURCHASE_SERVICE_ACCESS;
  if (!serviceUrl || !access) return NextResponse.next();
  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, serviceUrl);
  const headers = new Headers(request.headers);
  if (headers.get("origin") === request.nextUrl.origin) {
    headers.set("origin", "https://solo.flowsight.site");
  }
  headers.set("x-vercel-protection-bypass", access);
  return NextResponse.rewrite(target, { request: { headers } });
}

export const config = {
  matcher: ["/api/purchase/:path*", "/api/license/:path*", "/api/install/:path*", "/purchase/:path*", "/install"],
};
