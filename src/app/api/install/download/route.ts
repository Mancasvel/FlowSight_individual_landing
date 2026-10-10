import { NextRequest, NextResponse } from "next/server";
import { individualLicensePurchaseStatus } from "@/lib/individual-license.server";
import { normalizeIndividualLicenseCode } from "@/lib/individual-license";
import { purchaseAssetForPlatform } from "@/lib/individual-purchase";
import { signedPurchaseAssetUrl } from "@/lib/individual-purchase.server";

export const runtime = "nodejs";

function rejected(request: NextRequest, kind: "invalid" | "unavailable", status: number) {
  if (request.headers.get("accept")?.includes("text/html")) {
    return NextResponse.redirect(new URL(`/install?error=${kind}`, request.url), 303);
  }
  return NextResponse.json(
    { error: kind === "invalid" ? "The license or platform cannot be verified." : "The installer is temporarily unavailable." },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return rejected(request, "invalid", 400);
  }
  const code = normalizeIndividualLicenseCode(form.get("licenseCode"));
  const platform = form.get("platform");
  if (!code || typeof platform !== "string") {
    return rejected(request, "invalid", 400);
  }
  try {
    const asset = purchaseAssetForPlatform(platform);
    if (!asset || await individualLicensePurchaseStatus(code) !== "active") {
      return rejected(request, "invalid", 403);
    }
    const signedUrl = await signedPurchaseAssetUrl(asset);
    const response = NextResponse.redirect(signedUrl, 303);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch (error) {
    console.error("License-based installer download unavailable:", error);
    return rejected(request, "unavailable", 503);
  }
}
