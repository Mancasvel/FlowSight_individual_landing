import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { assertOneTimePrice, assertPurchaseAssetsExist, getPurchaseStripe } from "@/lib/individual-purchase.server";
import { assertIndividualLicenseStorageReady } from "@/lib/individual-license.server";
import { getPurchaseCheckoutConfig } from "@/lib/individual-purchase";
import { verifyPrivateLicenseStorage } from "@/lib/individual-license-storage.server";

export async function GET(request: Request) {
  const supplied = request.headers.get("x-purchase-setup") ?? "";
  const expected = process.env.INDIVIDUAL_SETUP_ACCESS ?? "";
  if (!expected || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return new NextResponse(null, { status: 404 });
  }
  try {
    const config = getPurchaseCheckoutConfig();
    await Promise.all([assertOneTimePrice(config.priceId, "individual"), assertPurchaseAssetsExist(), assertIndividualLicenseStorageReady()]);
    if (new URL(request.url).searchParams.get("verifyStorage") === "true") await verifyPrivateLicenseStorage();
    const account = await getPurchaseStripe().accounts.retrieve();
    return NextResponse.json({ ready: true, chargesEnabled: account.charges_enabled, country: account.country, priceId: config.priceId, amount: 2000, currency: "eur", licenseBackend: process.env.INDIVIDUAL_LICENSE_BACKEND }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ready: false, error: error instanceof Error ? error.message : "Purchase configuration failed" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
