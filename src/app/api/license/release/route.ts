import { NextResponse } from "next/server";
import { isIndividualLicensePlatform, isInstallationId, normalizeIndividualLicenseCode } from "@/lib/individual-license";
import { releaseIndividualInstallation } from "@/lib/individual-license.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 1024) return NextResponse.json({ error: "Release request is too large." }, { status: 413 });
    const body = JSON.parse(raw) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid release request." }, { status: 400 });
    }
    const fields = body as Record<string, unknown>;
    const code = normalizeIndividualLicenseCode(fields.licenseCode);
    if (!code || !isIndividualLicensePlatform(fields.platform) || !isInstallationId(fields.installationId)) {
      return NextResponse.json({ error: "Enter a valid license code and try again." }, { status: 400 });
    }
    const result = await releaseIndividualInstallation(code, fields.platform, fields.installationId);
    return NextResponse.json(
      { status: result, released: result === "released" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid release request." }, { status: 400 });
    }
    console.error("Individual license release unavailable:", error);
    return NextResponse.json(
      { error: "License release is temporarily unavailable. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
