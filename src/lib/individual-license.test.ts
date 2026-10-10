import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bulkDeliveryTokenForSession,
  individualInstallationHash,
  individualLicenseCodeForBulkSeat,
  individualLicenseCodeForSession,
  individualLicenseCodeHash,
  isValidBulkDeliveryToken,
  isIndividualLicensePlatform,
  isInstallationId,
  normalizeIndividualLicenseCode,
} from "./individual-license";

const secret = "0123456789abcdef".repeat(4);
const installationId = "550e8400-e29b-41d4-a716-446655440000";

describe("Individual local license primitives", () => {
  it("derives one stable high-entropy code per paid checkout session", () => {
    const code = individualLicenseCodeForSession("cs_test_purchase123", secret);
    assert.match(code, /^FSI-(?:[A-HJ-NP-Z2-9]{4}-){7}[A-HJ-NP-Z2-9]{4}$/);
    assert.equal(individualLicenseCodeForSession("cs_test_purchase123", secret), code);
    assert.notEqual(individualLicenseCodeForSession("cs_test_other456", secret), code);
    assert.equal(normalizeIndividualLicenseCode(code.toLowerCase().replaceAll("-", " ")), code);
    assert.equal(normalizeIndividualLicenseCode("FSI-not-a-license"), null);
    assert.equal(individualLicenseCodeHash(code).length, 64);
    assert.throws(() => individualLicenseCodeForSession("not-a-session", secret));
    assert.throws(() => individualLicenseCodeForSession("cs_test_purchase123", "short"));
  });

  it("accepts only three platforms and a random installation identifier", () => {
    assert.equal(isIndividualLicensePlatform("windows"), true);
    assert.equal(isIndividualLicensePlatform("macos"), true);
    assert.equal(isIndividualLicensePlatform("linux"), true);
    assert.equal(isIndividualLicensePlatform("mac-arm"), false);
    assert.equal(isInstallationId(installationId), true);
    assert.equal(isInstallationId("same-computer"), false);
    assert.notEqual(individualInstallationHash("windows", installationId), individualInstallationHash("linux", installationId));
  });

  it("derives distinct stable codes for every seat without changing individual codes", () => {
    const first = individualLicenseCodeForBulkSeat("cs_test_purchase123", secret, 1);
    const second = individualLicenseCodeForBulkSeat("cs_test_purchase123", secret, 2);
    assert.match(first, /^FSI-(?:[A-HJ-NP-Z2-9]{4}-){7}[A-HJ-NP-Z2-9]{4}$/);
    assert.notEqual(first, second);
    assert.notEqual(first, individualLicenseCodeForSession("cs_test_purchase123", secret));
    assert.equal(first, individualLicenseCodeForBulkSeat("cs_test_purchase123", secret, 1));
    assert.throws(() => individualLicenseCodeForBulkSeat("cs_test_purchase123", secret, 0));
    assert.throws(() => individualLicenseCodeForBulkSeat("cs_test_purchase123", secret, 501));
  });

  it("requires a separate buyer delivery token for a bulk CSV", () => {
    const token = bulkDeliveryTokenForSession("cs_test_purchase123", secret);
    assert.equal(isValidBulkDeliveryToken("cs_test_purchase123", token, secret), true);
    assert.equal(isValidBulkDeliveryToken("cs_test_other456", token, secret), false);
    assert.equal(isValidBulkDeliveryToken("cs_test_purchase123", "invalid", secret), false);
    assert.notEqual(token, individualLicenseCodeForBulkSeat("cs_test_purchase123", secret, 1));
  });
});
