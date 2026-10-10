import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BULK_LOCAL_PURCHASE_KIND,
  BULK_DISCOUNT_MIN_SEATS,
  BULK_PRICE_CENTS,
  INDIVIDUAL_PRICE_CENTS,
  INSTITUTIONAL_PRICE_CENTS,
  BUSINESS_BUYER_POLICY,
  PREVIOUS_OFFER_PRICE_CENTS,
  PREVIOUS_INDIVIDUAL_PRICE_CENTS,
  bulkUnitPriceCents,
  configuredPurchaseAssets,
  getBulkCheckoutConfig,
  getPurchaseCheckoutConfig,
  isBulkCheckoutConfigured,
  isIndividualCheckoutConfigured,
  isIndividualSessionId,
  isPaidIndividualSession,
  isPaidBulkSession,
  isPaidLocalPurchaseSession,
  isValidBulkLineItem,
  isValidBulkPrice,
  isUsablePurchaseCharge,
  isValidIndividualPrice,
  isEligibleBusinessSession,
  isValidIndividualLineItem,
  purchaseAssetForPlatform,
  parseBulkSeatCount,
} from "./individual-purchase";

const validEnvironment = {
  INDIVIDUAL_CHECKOUT_ENABLED: "true",
  STRIPE_SECRET_KEY: "sk_test_example",
  INDIVIDUAL_TAX_BEHAVIOR: "inclusive",
  STRIPE_INDIVIDUAL_WEBHOOK_SECRET: "whsec_example",
  STRIPE_PRICE_INDIVIDUAL_LOCAL: "price_example",
  STRIPE_PRICE_BULK_LOCAL: "price_bulk_example",
  RESEND_API_KEY: "re_example",
  RESEND_FROM_EMAIL: "FlowSight <verified@example.com>",
  INDIVIDUAL_LICENSE_SECRET: "0123456789abcdef".repeat(4),
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_example",
  R2_ACCOUNT_ID: "0123456789abcdef0123456789abcdef",
  R2_ACCESS_KEY_ID: "example-access-key",
  R2_SECRET_ACCESS_KEY: "example-secret-key",
  R2_BUCKET: "private-installers",
  INDIVIDUAL_WINDOWS_OBJECT_KEY: "v4.0.1/FlowSight.Agent_4.0.1_x64-setup.exe",
  INDIVIDUAL_MAC_ARM_OBJECT_KEY: "v3.6.11/FlowSight.Agent_3.6.11_aarch64.dmg",
  INDIVIDUAL_MAC_INTEL_OBJECT_KEY: "v3.6.11/FlowSight.Agent_3.6.11_x64.dmg",
  INDIVIDUAL_LINUX_DEB_OBJECT_KEY: "v3.5.2/FlowSight.Agent_3.5.2_amd64.deb",
  INDIVIDUAL_LINUX_APPIMAGE_OBJECT_KEY: "v3.5.2/FlowSight.Agent_3.5.2_amd64.AppImage",
};

describe("Individual one-time purchase guardrails", () => {
  it("defaults to checkout disabled and requires delivery configuration", () => {
    assert.throws(() => getPurchaseCheckoutConfig({}), /disabled/);
    assert.equal(isIndividualCheckoutConfigured({}), false);
    assert.equal(isIndividualCheckoutConfigured({ ...validEnvironment, R2_BUCKET: "" }), false);
    assert.equal(isIndividualCheckoutConfigured({ ...validEnvironment, STRIPE_SECRET_KEY: "" }), false);
    assert.equal(isIndividualCheckoutConfigured({ ...validEnvironment, INDIVIDUAL_MAC_ARM_OBJECT_KEY: "" }), false);
    assert.equal(isIndividualCheckoutConfigured({ ...validEnvironment, INDIVIDUAL_LICENSE_SECRET: "" }), false);
    assert.equal(isIndividualCheckoutConfigured({ ...validEnvironment, SUPABASE_SECRET_KEY: "" }), false);
    assert.equal(isIndividualCheckoutConfigured({ ...validEnvironment, NODE_ENV: "production" }), false);
    assert.equal(isIndividualCheckoutConfigured(validEnvironment), true);
    assert.throws(() => getPurchaseCheckoutConfig({ ...validEnvironment, R2_BUCKET: "" }), /R2_BUCKET/);
    assert.throws(() => getPurchaseCheckoutConfig({ ...validEnvironment, RESEND_FROM_EMAIL: "" }), /RESEND_FROM_EMAIL/);
    assert.equal(isIndividualCheckoutConfigured({ ...validEnvironment, INDIVIDUAL_TAX_BEHAVIOR: "exclusive" }), false);
    assert.equal(getPurchaseCheckoutConfig(validEnvironment).taxBehavior, "inclusive");
  });

  it("only exposes configured and safely named installers", () => {
    const assets = configuredPurchaseAssets(validEnvironment);
    assert.equal(assets.length, 5);
    assert.equal(assets[0].id, "windows");
    assert.equal(assets[0].filename, "FlowSight.Agent_4.0.1_x64-setup.exe");
    assert.equal(purchaseAssetForPlatform("mac-arm", validEnvironment)?.filename, "FlowSight.Agent_3.6.11_aarch64.dmg");
    assert.equal(purchaseAssetForPlatform("freebsd", validEnvironment), undefined);
    assert.throws(() => configuredPurchaseAssets({ ...validEnvironment, INDIVIDUAL_WINDOWS_OBJECT_KEY: "../secret.exe" }), /safe/);
    assert.throws(() => configuredPurchaseAssets({ ...validEnvironment, INDIVIDUAL_WINDOWS_OBJECT_KEY: "v4/installer.zip" }), /safe/);
  });

  it("requires a one-time EUR 20 tax-inclusive price for new individual purchases", () => {
    assert.equal(INDIVIDUAL_PRICE_CENTS, 2000);
    const price = { active: true, currency: "eur", unit_amount: INDIVIDUAL_PRICE_CENTS, type: "one_time", tax_behavior: "inclusive" };
    assert.equal(isValidIndividualPrice(price), true);
    assert.equal(isValidIndividualPrice({ ...price, unit_amount: BULK_PRICE_CENTS }), false);
    assert.equal(isValidIndividualPrice({ ...price, type: "recurring" }), false);
    assert.equal(isValidIndividualPrice({ ...price, tax_behavior: "exclusive" }), false);
    assert.equal(isValidBulkPrice({ ...price, unit_amount: BULK_PRICE_CENTS }), true);
    assert.equal(isValidBulkPrice(price), false);
    assert.equal(isValidBulkPrice({ ...price, unit_amount: BULK_PRICE_CENTS, active: false }), false);
  });

  it("does not accept subscription sessions, unpaid sessions, refunds, or disputes", () => {
    const session = {
      mode: "payment",
      payment_status: "paid",
      amount_total: INDIVIDUAL_PRICE_CENTS,
      currency: "eur",
      metadata: { purchaseKind: "individual_local", buyerPolicy: BUSINESS_BUYER_POLICY, businessDeclared: "true", priceId: "price_example" },
      payment_intent: "pi_example",
      customer_details: { business_name: "Example studio", address: { country: "ES" } },
      custom_fields: [{ key: "businessid", text: { value: "EXAMPLE123" } }, { key: "businesspurchase", dropdown: { value: "business" } }],
    };
    assert.equal(isPaidIndividualSession(session), true);
    assert.equal(isPaidIndividualSession({ ...session, amount_total: PREVIOUS_INDIVIDUAL_PRICE_CENTS }), true);
    assert.equal(isPaidIndividualSession({ ...session, amount_total: PREVIOUS_OFFER_PRICE_CENTS, metadata: { purchaseKind: "individual_local" }, customer_details: undefined, custom_fields: undefined }), true);
    assert.equal(isPaidIndividualSession({ ...session, metadata: { purchaseKind: "individual_local" } }), false);
    assert.equal(isPaidIndividualSession({ ...session, customer_details: { business_name: "", address: { country: "ES" } } }), false);
    assert.equal(isPaidIndividualSession({ ...session, mode: "subscription" }), false);
    assert.equal(isPaidIndividualSession({ ...session, payment_status: "unpaid" }), false);
    assert.equal(isPaidIndividualSession({ ...session, amount_total: 1200 }), false);
    assert.equal(isPaidIndividualSession({ ...session, currency: "usd" }), false);
    assert.equal(isPaidIndividualSession({ ...session, metadata: { purchaseKind: "individual_pro" } }), false);
    assert.equal(isUsablePurchaseCharge({ refunded: false, amount_refunded: 0, disputed: false }), true);
    assert.equal(isUsablePurchaseCharge({ refunded: true, amount_refunded: INDIVIDUAL_PRICE_CENTS, disputed: false }), false);
    assert.equal(isUsablePurchaseCharge({ refunded: false, amount_refunded: 1, disputed: false }), false);
    assert.equal(isUsablePurchaseCharge({ refunded: false, amount_refunded: 0, disputed: true }), false);
  });

  it("rejects malformed purchase link identifiers", () => {
    assert.equal(isIndividualSessionId("cs_test_abc123"), true);
    assert.equal(isIndividualSessionId("cs_live_abc123"), true);
    assert.equal(isIndividualSessionId("sub_abc123"), false);
    assert.equal(isIndividualSessionId("cs_test_abc123?platform=windows"), false);
    assert.equal(isIndividualSessionId(undefined), false);
  });

  it("keeps institutional checkout closed independently and validates batch size", () => {
    assert.equal(isBulkCheckoutConfigured(validEnvironment), false);
    assert.throws(() => getBulkCheckoutConfig(validEnvironment), /Bulk checkout is disabled/);
    assert.equal(isBulkCheckoutConfigured({ ...validEnvironment, BULK_CHECKOUT_ENABLED: "true" }), true);
    assert.equal(isBulkCheckoutConfigured({ ...validEnvironment, BULK_CHECKOUT_ENABLED: "true", STRIPE_PRICE_BULK_LOCAL: "" }), false);
    assert.throws(() => getBulkCheckoutConfig({ ...validEnvironment, BULK_CHECKOUT_ENABLED: "true", STRIPE_PRICE_BULK_LOCAL: "" }), /STRIPE_PRICE_BULK_LOCAL/);
    assert.equal(isBulkCheckoutConfigured({ ...validEnvironment, BULK_CHECKOUT_ENABLED: "true", STRIPE_PRICE_BULK_LOCAL: validEnvironment.STRIPE_PRICE_INDIVIDUAL_LOCAL }), false);
    assert.equal(isBulkCheckoutConfigured({ ...validEnvironment, BULK_CHECKOUT_ENABLED: "true", INDIVIDUAL_CHECKOUT_ENABLED: "false" }), false);
    assert.equal(parseBulkSeatCount("2"), 2);
    assert.equal(parseBulkSeatCount("500"), 500);
    for (const value of ["1", "501", "02", "2.5", "-2", "2e2", "", 10]) {
      assert.equal(parseBulkSeatCount(value), null);
    }
  });

  it("accepts only fully paid batches with a matching quantity and amount", () => {
    assert.equal(BULK_DISCOUNT_MIN_SEATS, 100);
    assert.equal(bulkUnitPriceCents(99), INSTITUTIONAL_PRICE_CENTS);
    assert.equal(bulkUnitPriceCents(100), BULK_PRICE_CENTS);
    for (const [seatCount, totalCents, priceCents] of [
      [2, 5_000, INSTITUTIONAL_PRICE_CENTS],
      [99, 247_500, INSTITUTIONAL_PRICE_CENTS],
      [100, 100_000, BULK_PRICE_CENTS],
      [500, 500_000, BULK_PRICE_CENTS],
    ]) {
      const metadata = { purchaseKind: BULK_LOCAL_PURCHASE_KIND, seatCount: String(seatCount), priceId: "price_example" };
      const boundarySession = {
        mode: "payment", payment_status: "paid", amount_total: totalCents,
        currency: "eur", metadata, payment_intent: "pi_example",
      };
      const boundaryItem = { quantity: seatCount, price: { id: "price_example", currency: "eur", unit_amount: priceCents, type: "one_time", tax_behavior: "inclusive" } };
      assert.equal(isPaidBulkSession(boundarySession), true, `${seatCount} seats should cost ${totalCents} cents`);
      assert.equal(isValidBulkLineItem(boundaryItem, metadata), true, `${seatCount} seats should use ${priceCents} cents per license`);
      assert.equal(isValidBulkLineItem({ ...boundaryItem, price: { ...boundaryItem.price, unit_amount: priceCents === BULK_PRICE_CENTS ? INDIVIDUAL_PRICE_CENTS : BULK_PRICE_CENTS } }, metadata), false);
    }
    const session = {
      mode: "payment",
      payment_status: "paid",
      amount_total: 250_000,
      currency: "eur",
      metadata: { purchaseKind: BULK_LOCAL_PURCHASE_KIND, seatCount: "250", priceId: "price_example" },
      payment_intent: "pi_example",
    };
    assert.equal(isPaidBulkSession(session), true);
    assert.equal(isPaidLocalPurchaseSession(session), true);
    assert.equal(isPaidBulkSession({ ...session, amount_total: 249_999 }), false);
    assert.equal(isPaidBulkSession({ ...session, metadata: { ...session.metadata, seatCount: "251" } }), false);
    assert.equal(isPaidBulkSession({ ...session, payment_status: "unpaid" }), false);
    assert.equal(isPaidBulkSession({ ...session, metadata: { ...session.metadata, purchaseKind: "individual_local" } }), false);
    const item = { quantity: 250, price: { id: "price_example", currency: "eur", unit_amount: 1000, type: "one_time", tax_behavior: "inclusive" } };
    assert.equal(isValidBulkLineItem(item, session.metadata), true);
    assert.equal(isValidBulkLineItem({ ...item, quantity: 249 }, session.metadata), false);
    assert.equal(isValidBulkLineItem({ ...item, price: { ...item.price, id: "price_other" } }, session.metadata), false);
    assert.equal(isValidBulkLineItem({ ...item, price: { ...item.price, unit_amount: 900 } }, session.metadata), false);
  });

  it("requires business billing details for domestic and overseas buyers", () => {
    const session = {
      metadata: { buyerPolicy: BUSINESS_BUYER_POLICY, businessDeclared: "true" },
      customer_details: { business_name: "A business", address: { country: "ES" } },
      custom_fields: [{ key: "businessid", text: { value: "EXAMPLE123" } }, { key: "businesspurchase", dropdown: { value: "business" } }],
    };
    for (const country of ["ES", "DE", "US"]) {
      assert.equal(isEligibleBusinessSession({ ...session, customer_details: { business_name: "A business", address: { country } } }), true);
    }
    assert.equal(isEligibleBusinessSession({ ...session, metadata: null }), false);
    assert.equal(isEligibleBusinessSession({ ...session, customer_details: null }), false);
    assert.equal(isEligibleBusinessSession({ ...session, custom_fields: [] }), false);
    assert.equal(isEligibleBusinessSession({ ...session, custom_fields: [{ key: "businessid", text: { value: "EXAMPLE123" } }, { key: "businesspurchase", dropdown: { value: "consumer" } }] }), false);
    assert.equal(isEligibleBusinessSession({ ...session, customer_details: { business_name: "", address: { country: "US" } } }), false);
  });

  it("matches the paid price and a single license rather than relying on session metadata alone", () => {
    const item = { quantity: 1, price: { id: "price_current", currency: "eur", unit_amount: 2000, type: "one_time", tax_behavior: "inclusive" } };
    const session = { amount_total: 2000, metadata: { priceId: "price_current" } };
    assert.equal(isValidIndividualLineItem(item, session), true);
    assert.equal(isValidIndividualLineItem({ ...item, quantity: 2 }, session), false);
    assert.equal(isValidIndividualLineItem({ ...item, price: { ...item.price, id: "price_other" } }, session), false);
    assert.equal(isValidIndividualLineItem({ ...item, price: { ...item.price, unit_amount: 2500 } }, session), false);
    assert.equal(isValidIndividualLineItem({ ...item, price: { ...item.price, tax_behavior: "exclusive" } }, session), false);
    assert.equal(isValidIndividualLineItem({ ...item, price: null }, session), false);
    for (const historicalPrice of [1000, 2500]) {
      assert.equal(isValidIndividualLineItem({ ...item, price: { ...item.price, unit_amount: historicalPrice } }, { amount_total: historicalPrice, metadata: null }), true);
    }
  });
});
