import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/site";
import { getPurchaseCheckoutConfig } from "@/lib/individual-purchase";
import { businessCheckoutParams, parseBusinessCheckoutInput } from "@/lib/business-checkout";
import { assertIndividualLicenseStorageReady } from "@/lib/individual-license.server";
import { assertOneTimePrice, assertPurchaseAssetsExist, getPurchaseStripe } from "@/lib/individual-purchase.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || (origin !== new URL(request.url).origin && origin !== new URL(absoluteUrl("/")).origin)) {
    return NextResponse.json({ error: "Open checkout from the FlowSight website." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
    return NextResponse.json({ error: "Submit the business purchase form." }, { status: 415 });
  }
  const raw = await request.text();
  if (raw.length > 4096) return NextResponse.json({ error: "Purchase request is too large." }, { status: 413 });
  const buyer = parseBusinessCheckoutInput(new URLSearchParams(raw));
  if (!buyer) {
    return NextResponse.json({ error: "Purchases are limited to companies and self-employed professionals. Enter your legal business name, fiscal ID and professional-use declaration." }, { status: 400 });
  }
  if (process.env.INDIVIDUAL_CHECKOUT_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Individual checkout has not opened yet. No payment was taken." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    const config = getPurchaseCheckoutConfig();
    await Promise.all([
      assertOneTimePrice(config.priceId, "individual"),
      assertPurchaseAssetsExist(),
      assertIndividualLicenseStorageReady(),
    ]);

    const session = await getPurchaseStripe().checkout.sessions.create(
      businessCheckoutParams(config.priceId, absoluteUrl("/").replace(/\/$/, ""), buyer),
    );
    if (!session.url) throw new Error("Stripe did not provide a checkout URL");
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Individual checkout unavailable:", error);
    if (request.headers.get("accept")?.includes("text/html")) {
      return NextResponse.redirect(absoluteUrl("/purchase/unavailable"), 303);
    }
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. No payment was taken. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
