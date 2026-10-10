import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const INDIVIDUAL_LICENSE_PLATFORMS = ["windows", "macos", "linux"] as const;
export type IndividualLicensePlatform = (typeof INDIVIDUAL_LICENSE_PLATFORMS)[number];

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const codePayloadPattern = /^[A-HJ-NP-Z2-9]{32}$/;
const installationIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isIndividualLicensePlatform(value: unknown): value is IndividualLicensePlatform {
  return typeof value === "string" && INDIVIDUAL_LICENSE_PLATFORMS.includes(value as IndividualLicensePlatform);
}

export function isInstallationId(value: unknown): value is string {
  return typeof value === "string" && installationIdPattern.test(value);
}

export function normalizeIndividualLicenseCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const compact = value.trim().toUpperCase().replace(/[\s-]+/g, "");
  const payload = compact.slice(3);
  return compact.startsWith("FSI") && codePayloadPattern.test(payload)
    ? `FSI-${payload.match(/.{4}/g)?.join("-")}`
    : null;
}

function encodeIndividualLicenseCode(bytes: Buffer): string {
  let bits = 0;
  let buffer = 0;
  let encoded = "";
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      encoded += alphabet[(buffer >>> bits) & 31];
    }
  }
  return `FSI-${encoded.match(/.{4}/g)?.join("-") ?? ""}`;
}

function validLicenseDerivationInputs(sessionId: string, secretHex: string): void {
  if (!/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    throw new Error("A valid Stripe checkout session is required");
  }
  if (!/^[a-fA-F0-9]{64}$/.test(secretHex)) {
    throw new Error("INDIVIDUAL_LICENSE_SECRET must be a 32-byte hex secret");
  }
}

export function individualLicenseCodeForSession(sessionId: string, secretHex: string): string {
  validLicenseDerivationInputs(sessionId, secretHex);
  const bytes = createHmac("sha256", Buffer.from(secretHex, "hex"))
    .update(`flowsight-individual-local-v1:${sessionId}`)
    .digest()
    .subarray(0, 20);
  return encodeIndividualLicenseCode(bytes);
}

/** One stable, independent code for each paid seat in an institutional batch. */
export function individualLicenseCodeForBulkSeat(sessionId: string, secretHex: string, seatNumber: number): string {
  validLicenseDerivationInputs(sessionId, secretHex);
  if (!Number.isInteger(seatNumber) || seatNumber < 1 || seatNumber > 500) {
    throw new Error("Bulk license seat number must be between 1 and 500");
  }
  const bytes = createHmac("sha256", Buffer.from(secretHex, "hex"))
    .update(`flowsight-individual-local-bulk-v1:${sessionId}:${seatNumber}`)
    .digest()
    .subarray(0, 20);
  return encodeIndividualLicenseCode(bytes);
}

/** The buyer's email link needs a separate proof beyond the Stripe session ID. */
export function bulkDeliveryTokenForSession(sessionId: string, secretHex: string): string {
  validLicenseDerivationInputs(sessionId, secretHex);
  return createHmac("sha256", Buffer.from(secretHex, "hex"))
    .update(`flowsight-bulk-delivery-v1:${sessionId}`)
    .digest("base64url");
}

export function isValidBulkDeliveryToken(sessionId: string, token: unknown, secretHex: string): boolean {
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  try {
    const expected = bulkDeliveryTokenForSession(sessionId, secretHex);
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function individualLicenseCodeHash(code: string): string {
  const normalized = normalizeIndividualLicenseCode(code);
  if (!normalized) throw new Error("Invalid Individual license code");
  return createHash("sha256").update(normalized).digest("hex");
}

export function individualInstallationHash(platform: IndividualLicensePlatform, installationId: string): string {
  if (!isInstallationId(installationId)) throw new Error("Invalid installation ID");
  return createHash("sha256")
    .update(`flowsight-individual-local-v1:${platform}:${installationId.toLowerCase()}`)
    .digest("hex");
}
