import { NextResponse } from "next/server";
import { isIndividualLicensePlatform, isInstallationId, normalizeIndividualLicenseCode } from "@/lib/individual-license";
import { activateIndividualInstallation } from "@/lib/individual-license.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 1024) return NextResponse.json({ error: "Activation request is too large." }, { status: 413 });
    const body = JSON.parse(raw) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid activation request." }, { status: 400 });
    }
    const fields = body as Record<string, unknown>;
    const code = normalizeIndividualLicenseCode(fields.licenseCode);
    if (!code || !isIndividualLicensePlatform(fields.platform) || !isInstallationId(fields.installationId)) {
      return NextResponse.json({ error: "Enter a valid license code and try again." }, { status: 400 });
    }

    const result = await activateIndividualInstallation(code, fields.platform, fields.installationId);
    if (result === "active" || result === "activated") {
      return NextResponse.json({ status: "active", platform: fields.platform }, { headers: { "Cache-Control": "no-store" } });
    }
    if (result === "slot_taken") {
      return NextResponse.json(
        { error: "This license is already active on another computer using this operating system. Deactivate it there or contact support." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (result === "invalid" || result === "revoked" || result === "purchase_inactive") {
      return NextResponse.json(
        { error: "This license cannot be activated. Check the code or contact support." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
    throw new Error("Unexpected license activation result");
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid activation request." }, { status: 400 });
    }
    console.error("Individual activation unavailable:", error);
    return NextResponse.json(
      { error: "Activation is temporarily unavailable. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
