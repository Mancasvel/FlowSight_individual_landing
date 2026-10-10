import "server-only";
import { randomUUID } from "node:crypto";
import type { IndividualLicensePlatform } from "./individual-license";

const bucket = "flowsight-solo-licenses";
type LicenseRecord = { stripe_session_id: string; stripe_payment_intent_id: string; code_hash: string; revoked_at: string | null };

async function storage(path: string, init: RequestInit = {}) {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Private license storage is not configured");
  return fetch(`${url}/storage/v1/${path}`, { ...init, cache: "no-store", signal: AbortSignal.timeout(10000), headers: {
    apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers,
  } });
}

async function read<T>(path: string): Promise<T | null> {
  const response = await storage(`object/authenticated/${bucket}/${path}`);
  if (response.ok) return response.json() as Promise<T>;
  const error = await response.json().catch(() => ({})) as { statusCode?: string; error?: string };
  if (response.status === 404 || error.statusCode === "404" || error.error === "not_found") return null;
  throw new Error(`Private license storage read failed (${response.status})`);
}

/** Storage creates objects atomically; an existing key is never overwritten here. */
async function create(path: string, value: unknown): Promise<boolean> {
  const response = await storage(`object/${bucket}/${path}`, { method: "POST", headers: { "x-upsert": "false" }, body: JSON.stringify(value) });
  if (response.ok) return true;
  const error = await response.json().catch(() => ({})) as { statusCode?: string; error?: string };
  if (response.status === 409 || error.statusCode === "409" || error.error === "Duplicate") return false;
  throw new Error(`Private license storage write failed (${response.status})`);
}

async function remove(paths: string[]) {
  const response = await storage(`object/${bucket}`, { method: "DELETE", body: JSON.stringify({ prefixes: paths }) });
  if (!response.ok) throw new Error("Private license storage cleanup failed");
}

export async function assertStorageLicenseReady() {
  const response = await storage(`bucket/${bucket}`);
  if (!response.ok) throw new Error("Private license bucket is unavailable");
  const config = await response.json() as { public: boolean };
  if (config.public) throw new Error("License storage must be private");
}

export async function storageLicenseBy(field: "stripe_session_id" | "code_hash", value: string): Promise<LicenseRecord | null> {
  return read<LicenseRecord>(`${field === "code_hash" ? "codes" : "sessions"}/${value}.json`);
}

export async function ensureStorageLicense(sessionId: string, paymentIntentId: string, codeHash: string) {
  const record: LicenseRecord = { stripe_session_id: sessionId, stripe_payment_intent_id: paymentIntentId, code_hash: codeHash, revoked_at: null };
  for (const path of [`payments/${paymentIntentId}.json`, `codes/${codeHash}.json`, `sessions/${sessionId}.json`]) {
    await create(path, record);
    const stored = await read<LicenseRecord>(path);
    if (!stored || stored.code_hash !== codeHash || stored.stripe_session_id !== sessionId || stored.stripe_payment_intent_id !== paymentIntentId || stored.revoked_at) throw new Error("License registration needs support review");
  }
}

/** A crashed operation leaves a lock for support; it never admits two devices. */
async function withSlotLock<T>(codeHash: string, platform: IndividualLicensePlatform, action: () => Promise<T>): Promise<T> {
  const path = `locks/${codeHash}-${platform}.json`;
  if (!await create(path, { operation: randomUUID(), started_at: new Date().toISOString() })) throw new Error("Another license operation is in progress. Retry shortly or contact support.");
  try { return await action(); } finally { await remove([path]); }
}

export async function activateStorageInstallation(codeHash: string, platform: IndividualLicensePlatform, installationHash: string): Promise<string> {
  return withSlotLock(codeHash, platform, async () => {
    const license = await storageLicenseBy("code_hash", codeHash);
    if (!license) return "invalid";
    if (license.revoked_at) return "revoked";
    const path = `slots/${codeHash}-${platform}.json`;
    const slot = await read<{ installation_hash: string }>(path);
    if (slot) return slot.installation_hash === installationHash ? "active" : "slot_taken";
    if (!await create(path, { installation_hash: installationHash, activated_at: new Date().toISOString() })) throw new Error("License activation needs retry");
    return "activated";
  });
}

export async function releaseStorageInstallation(codeHash: string, platform: IndividualLicensePlatform, installationHash: string): Promise<string> {
  return withSlotLock(codeHash, platform, async () => {
    if (!await storageLicenseBy("code_hash", codeHash)) return "invalid";
    const path = `slots/${codeHash}-${platform}.json`;
    const slot = await read<{ installation_hash: string }>(path);
    if (!slot || slot.installation_hash !== installationHash) return "not_active";
    await remove([path]);
    return "released";
  });
}

export async function verifyPrivateLicenseStorage(): Promise<void> {
  const token = randomUUID().replaceAll("-", "");
  const sessionId = `cs_test_storage${token}`;
  const paymentId = `pi_storage${token}`;
  const codeHash = token.repeat(2);
  const first = "1".repeat(64);
  const second = "2".repeat(64);
  const paths = [`payments/${paymentId}.json`, `sessions/${sessionId}.json`, `codes/${codeHash}.json`, `slots/${codeHash}-windows.json`, `locks/${codeHash}-windows.json`];
  try {
    await ensureStorageLicense(sessionId, paymentId, codeHash);
    await ensureStorageLicense(sessionId, paymentId, codeHash);
    if (await activateStorageInstallation(codeHash, "windows", first) !== "activated") throw new Error("Initial activation failed");
    if (await activateStorageInstallation(codeHash, "windows", first) !== "active") throw new Error("Activation verification failed");
    if (await activateStorageInstallation(codeHash, "windows", second) !== "slot_taken") throw new Error("Concurrent device protection failed");
    if (await releaseStorageInstallation(codeHash, "windows", second) !== "not_active") throw new Error("Wrong device release was accepted");
    if (await releaseStorageInstallation(codeHash, "windows", first) !== "released") throw new Error("Device release failed");
    if (await activateStorageInstallation(codeHash, "windows", second) !== "activated") throw new Error("Device transfer failed");
  } finally {
    await remove(paths);
  }
}
