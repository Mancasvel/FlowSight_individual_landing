import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { activateStorageInstallation, ensureStorageLicense, releaseStorageInstallation, storageLicenseBy } from "./individual-license-storage.server";

const originalFetch = globalThis.fetch;
const objects = new Map<string, unknown>();
const codeHash = "a".repeat(64);
let failReads = false;
const previousEnv = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SECRET_KEY };

before(() => {
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "fixture-secret";
  globalThis.fetch = (async (input, init) => {
    const url = new URL(String(input));
    const method = init?.method ?? "GET";
    if (method === "DELETE") {
      const body = JSON.parse(String(init?.body)) as { prefixes: string[] };
      for (const path of body.prefixes) objects.delete(path);
      return Response.json({});
    }
    const path = url.pathname.replace(/^\/storage\/v1\/object\/(?:authenticated\/)?flowsight-solo-licenses\//, "");
    if (method === "POST") {
      if (objects.has(path)) return Response.json({ error: "Duplicate", statusCode: "409" }, { status: 400 });
      objects.set(path, JSON.parse(String(init?.body)));
      return Response.json({});
    }
    if (failReads) return Response.json({ error: "storage unavailable" }, { status: 503 });
    return objects.has(path) ? Response.json(objects.get(path)) : Response.json({ error: "not_found", statusCode: "404" }, { status: 400 });
  }) as typeof fetch;
});

after(() => {
  globalThis.fetch = originalFetch;
  if (previousEnv.url === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = previousEnv.url;
  if (previousEnv.key === undefined) delete process.env.SUPABASE_SECRET_KEY; else process.env.SUPABASE_SECRET_KEY = previousEnv.key;
});

describe("private license registration and device slots", () => {
  it("is idempotent and refuses to reuse a payment or code for a different purchase", async () => {
    await ensureStorageLicense("cs_test_storage1", "pi_storage1", codeHash);
    await ensureStorageLicense("cs_test_storage1", "pi_storage1", codeHash);
    assert.equal((await storageLicenseBy("code_hash", codeHash))?.stripe_session_id, "cs_test_storage1");
    await assert.rejects(ensureStorageLicense("cs_test_storage2", "pi_storage1", "b".repeat(64)), /support review/);
    assert.equal(objects.size, 3);
  });

  it("serializes competing device activations and releases only the matching device", async () => {
    const results = await Promise.allSettled([
      activateStorageInstallation(codeHash, "windows", "1".repeat(64)),
      activateStorageInstallation(codeHash, "windows", "2".repeat(64)),
    ]);
    assert.equal(results.filter((result) => result.status === "fulfilled" && result.value === "activated").length, 1);
    assert.equal(await activateStorageInstallation(codeHash, "windows", "1".repeat(64)), "active");
    assert.equal(await activateStorageInstallation(codeHash, "windows", "2".repeat(64)), "slot_taken");
    assert.equal(await releaseStorageInstallation(codeHash, "windows", "2".repeat(64)), "not_active");
    assert.equal(await releaseStorageInstallation(codeHash, "windows", "1".repeat(64)), "released");
    assert.equal(await activateStorageInstallation(codeHash, "windows", "2".repeat(64)), "activated");
    assert.equal(await activateStorageInstallation(codeHash, "macos", "3".repeat(64)), "activated");
    assert.equal(await activateStorageInstallation(codeHash, "linux", "4".repeat(64)), "activated");
    assert.equal([...objects.keys()].some((key) => key.startsWith("locks/")), false);
  });

  it("fails closed on storage errors and removes an owned operation lock", async () => {
    failReads = true;
    await assert.rejects(activateStorageInstallation(codeHash, "windows", "2".repeat(64)), /read failed/);
    failReads = false;
    assert.equal([...objects.keys()].some((key) => key.startsWith("locks/")), false);
    assert.equal(await activateStorageInstallation(codeHash, "windows", "2".repeat(64)), "active");
    assert.equal(await activateStorageInstallation("c".repeat(64), "windows", "2".repeat(64)), "invalid");
  });
});
