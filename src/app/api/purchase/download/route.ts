import { NextRequest, NextResponse } from "next/server";
import { getPaidPurchaseSession, signedPurchaseAssetUrl } from "@/lib/individual-purchase.server";
import { isIndividualSessionId, purchaseAssetForPlatform } from "@/lib/individual-purchase";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const platform = request.nextUrl.searchParams.get("platform");
  if (!isIndividualSessionId(sessionId)) {
    return NextResponse.json({ error: "A valid purchase link is required." }, { status: 400 });
  }

  try {
    const asset = purchaseAssetForPlatform(platform);
    if (!asset) {
      return NextResponse.json({ error: "This installer is not available." }, { status: 404 });
    }
    const session = await getPaidPurchaseSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "This purchase cannot be verified. Contact support if you believe this is a mistake." }, { status: 403 });
    }
    const url = await signedPurchaseAssetUrl(asset);
    const response = NextResponse.redirect(url, 302);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch (error) {
    console.error("Individual download unavailable:", error);
    return NextResponse.json(
      { error: "The installer is temporarily unavailable. Please try again or contact support." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
