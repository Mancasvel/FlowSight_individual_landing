import "server-only";

import type Stripe from "stripe";
import {
  individualInstallationHash,
  individualLicenseCodeForSession,
  individualLicenseCodeForBulkSeat,
  individualLicenseCodeHash,
  type IndividualLicensePlatform,
} from "@/lib/individual-license";
import { isPaidBulkSession, isPaidIndividualSession, parseBulkSeatCount } from "@/lib/individual-purchase";
import { getPaidPurchaseSession } from "@/lib/individual-purchase.server";
import { activateStorageInstallation, assertStorageLicenseReady, ensureStorageLicense, storageLicenseBy, releaseStorageInstallation } from "./individual-license-storage.server";

type StoredLicense = {
  stripe_session_id: string;
  code_hash: string;
  revoked_at: string | null;
};

function licenseStorageConfig() {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  const secret = process.env.INDIVIDUAL_LICENSE_SECRET?.trim();
  if (process.env.INDIVIDUAL_LICENSE_BACKEND === "supabase_storage") {
    if (!secret || !/^[a-fA-F0-9]{64}$/.test(secret)) throw new Error("Individual license secret is not configured");
    return { url: "", key: "", secret };
  }
  if (!url || !/^https:\/\/[A-Za-z0-9-]+\.supabase\.co\/?$/.test(url) || !key || !secret || !/^[a-fA-F0-9]{64}$/.test(secret)) {
    throw new Error("Individual license storage is not configured");
  }
  return { url: url.replace(/\/$/, ""), key, secret };
}

async function storageRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const config = licenseStorageConfig();
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  return response;
}

async function licenseBy(field: "stripe_session_id" | "code_hash", value: string): Promise<StoredLicense | null> {
  if (process.env.INDIVIDUAL_LICENSE_BACKEND === "supabase_storage") {
    return storageLicenseBy(field, value);
  }
  const query = new URLSearchParams({ select: "stripe_session_id,code_hash,revoked_at", [field]: `eq.${value}` });
  const response = await storageRequest(`individual_local_licenses?${query.toString()}`);
  if (!response.ok) throw new Error(`Individual license lookup failed (HTTP ${response.status})`);
  const rows = await response.json() as StoredLicense[];
  return rows[0] ?? null;
}

/** Idempotent across webhook retries and visits to the success page. */
export async function ensureIndividualLicense(session: Stripe.Checkout.Session): Promise<string> {
  if (!isPaidIndividualSession(session) || !session.payment_intent) {
    throw new Error("A paid Individual checkout is required before issuing a license");
  }
  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent.id;
  const code = individualLicenseCodeForSession(session.id, licenseStorageConfig().secret);
  const codeHash = individualLicenseCodeHash(code);
  if (process.env.INDIVIDUAL_LICENSE_BACKEND === "supabase_storage") {
    await ensureStorageLicense(session.id, paymentIntentId, codeHash);
    return code;
  }

  const existing = await licenseBy("stripe_session_id", session.id);
  if (existing) {
    if (existing.code_hash !== codeHash || existing.revoked_at) {
      throw new Error("Individual license needs support review");
    }
    return code;
  }

  const response = await storageRequest("individual_local_licenses", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      code_hash: codeHash,
    }),
  });
  if (!response.ok && response.status !== 409) {
    throw new Error(`Individual license creation failed (HTTP ${response.status})`);
  }
  // A concurrent webhook may have inserted the same session first. Verify its
  // code hash rather than emailing an unregistered or rotated code.
  const stored = await licenseBy("stripe_session_id", session.id);
  if (!stored || stored.code_hash !== codeHash || stored.revoked_at) {
    throw new Error("Individual license creation could not be confirmed");
  }
  return code;
}

type StoredBulkLicense = { license_number: number; code_hash: string; revoked_at: string | null };

async function bulkLicensesBySession(sessionId: string, limit: number): Promise<StoredBulkLicense[]> {
  const query = new URLSearchParams({
    select: "license_number,code_hash,revoked_at",
    stripe_session_id: `eq.${sessionId}`,
    order: "license_number.asc",
    limit: String(limit),
  });
  const response = await storageRequest(`individual_local_licenses?${query.toString()}`);
  if (!response.ok) throw new Error(`Institutional license lookup failed (HTTP ${response.status})`);
  return await response.json() as StoredBulkLicense[];
}

async function bulkLicenseNumberByHash(codeHash: string): Promise<number | null> {
  const query = new URLSearchParams({ select: "license_number", code_hash: `eq.${codeHash}` });
  const response = await storageRequest(`individual_local_licenses?${query}`);
  if (!response.ok) throw new Error(`Institutional license lookup failed (HTTP ${response.status})`);
  const rows = await response.json() as { license_number: number }[];
  return rows[0]?.license_number ?? null;
}

/** A retried webhook and the delivery page converge on the same verified set. */
export async function ensureBulkLicenses(session: Stripe.Checkout.Session): Promise<string[]> {
  const count = parseBulkSeatCount(session.metadata?.seatCount);
  if (!isPaidBulkSession(session) || count === null || !session.payment_intent) {
    throw new Error("A paid institutional checkout is required before issuing licenses");
  }
  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent.id;
  const secret = licenseStorageConfig().secret;
  const expected = Array.from({ length: count }, (_, index) => {
    const licenseNumber = index + 1;
    const code = individualLicenseCodeForBulkSeat(session.id, secret, licenseNumber);
    return { licenseNumber, code, codeHash: individualLicenseCodeHash(code) };
  });
  const onConflict = new URLSearchParams({ on_conflict: "stripe_session_id,license_number" });
  const response = await storageRequest(`individual_local_licenses?${onConflict}`, {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify(expected.map((seat) => ({
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      license_number: seat.licenseNumber,
      code_hash: seat.codeHash,
    }))),
  });
  if (!response.ok) {
    throw new Error(`Institutional license creation failed (HTTP ${response.status})`);
  }
  const stored = await bulkLicensesBySession(session.id, count + 1);
  if (stored.length !== count || expected.some((seat, index) =>
    stored[index].license_number !== seat.licenseNumber ||
    stored[index].code_hash !== seat.codeHash ||
    stored[index].revoked_at !== null
  )) {
    throw new Error("Institutional license batch could not be confirmed");
  }
  return expected.map((seat) => seat.code);
}

export async function assertBulkLicenseStorageReady(): Promise<void> {
  const response = await storageRequest("rpc/bulk_local_license_schema_ready", {
    method: "POST",
    body: "{}",
  });
  if (!response.ok || await response.json() !== true) {
    throw new Error("Institutional license storage is not ready");
  }
  await bulkActivationSummary("cs_test_preflight");
}

/** Aggregate activation count for a previously verified institutional order. */
export async function bulkActivationSummary(sessionId: string): Promise<{ purchased: number; activated: number }> {
  const response = await storageRequest("rpc/organization_local_activation_summary", {
    method: "POST",
    body: JSON.stringify({ p_session_id: sessionId }),
  });
  if (!response.ok) throw new Error(`Institutional activation summary unavailable (HTTP ${response.status})`);
  const value = await response.json() as { purchased?: unknown; activated?: unknown };
  if (!Number.isInteger(value.purchased) || !Number.isInteger(value.activated) ||
      (value.purchased as number) < 0 || (value.activated as number) < 0 ||
      (value.activated as number) > (value.purchased as number)) {
    throw new Error("Institutional activation summary is invalid");
  }
  return { purchased: value.purchased as number, activated: value.activated as number };
}

async function licenseRpc(functionName: string, codeHash: string, platform: IndividualLicensePlatform, installationHash: string): Promise<string> {
  const response = await storageRequest(`rpc/${functionName}`, {
    method: "POST",
    body: JSON.stringify({
      p_code_hash: codeHash,
      p_platform: platform,
      p_installation_hash: installationHash,
    }),
  });
  if (!response.ok) throw new Error(`Individual license activation unavailable (HTTP ${response.status})`);
  return await response.json() as string;
}

/** Refuse a checkout if the private license table or activation RPC is missing. */
export async function assertIndividualLicenseStorageReady(): Promise<void> {
  if (process.env.INDIVIDUAL_LICENSE_BACKEND === "supabase_storage") return assertStorageLicenseReady();
  const response = await storageRequest("individual_local_licenses?select=id&limit=0");
  if (!response.ok) throw new Error(`Individual license storage is unavailable (HTTP ${response.status})`);
  const probe = await licenseRpc(
    "activate_individual_local_installation",
    "0".repeat(64),
    "windows",
    "0".repeat(64),
  );
  if (probe !== "invalid") throw new Error("Individual license activation is not ready");
}

export async function activateIndividualInstallation(code: string, platform: IndividualLicensePlatform, installationId: string): Promise<string> {
  const status = await individualLicensePurchaseStatus(code);
  if (status !== "active") return status;
  if (process.env.INDIVIDUAL_LICENSE_BACKEND === "supabase_storage") {
    return activateStorageInstallation(individualLicenseCodeHash(code), platform, individualInstallationHash(platform, installationId));
  }
  return licenseRpc("activate_individual_local_installation", individualLicenseCodeHash(code), platform, individualInstallationHash(platform, installationId));
}

/** Validates a single or bulk code against its original paid checkout. */
export async function individualLicensePurchaseStatus(code: string): Promise<"active" | "invalid" | "revoked" | "purchase_inactive"> {
  const codeHash = individualLicenseCodeHash(code);
  const license = await licenseBy("code_hash", codeHash);
  if (!license) return "invalid";
  if (license.revoked_at) return "revoked";
  const session = await getPaidPurchaseSession(license.stripe_session_id);
  if (!session) return "purchase_inactive";
  const secret = licenseStorageConfig().secret;
  if (isPaidIndividualSession(session)) {
    return codeHash === individualLicenseCodeHash(individualLicenseCodeForSession(session.id, secret))
      ? "active" : "invalid";
  }
  const seatCount = parseBulkSeatCount(session.metadata?.seatCount);
  if (!isPaidBulkSession(session) || seatCount === null) return "invalid";
  const licenseNumber = await bulkLicenseNumberByHash(codeHash);
  return licenseNumber !== null && licenseNumber >= 1 && licenseNumber <= seatCount &&
    codeHash === individualLicenseCodeHash(individualLicenseCodeForBulkSeat(session.id, secret, licenseNumber))
      ? "active" : "invalid";
}

export async function releaseIndividualInstallation(code: string, platform: IndividualLicensePlatform, installationId: string): Promise<string> {
  if (process.env.INDIVIDUAL_LICENSE_BACKEND === "supabase_storage") {
    return releaseStorageInstallation(individualLicenseCodeHash(code), platform, individualInstallationHash(platform, installationId));
  }
  return licenseRpc(
    "release_individual_local_installation",
    individualLicenseCodeHash(code),
    platform,
    individualInstallationHash(platform, installationId),
  );
}
