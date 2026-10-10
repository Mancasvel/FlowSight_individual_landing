import assert from "node:assert/strict";
import { before, describe, it, mock } from "node:test";
import { getPaidPurchaseSession, getPurchaseStripe, sendPurchaseDeliveryEmail } from "./individual-purchase.server";
import { BUSINESS_BUYER_POLICY } from "./individual-purchase";

const session = {
  id: "cs_test_fixture", mode: "payment", payment_status: "paid", amount_total: 2000, currency: "eur", payment_intent: "pi_fixture", invoice: "in_fixture",
  metadata: { purchaseKind: "individual_local", buyerPolicy: BUSINESS_BUYER_POLICY, businessDeclared: "true", priceId: "price_fixture" },
  customer_details: { business_name: "Example Studio", address: { country: "ES" } },
  custom_fields: [{ key: "businessid", text: { value: "EXAMPLE123" } }, { key: "businesspurchase", dropdown: { value: "business" } }],
};
const item = { quantity: 1, price: { id: "price_fixture", unit_amount: 2000, currency: "eur", type: "one_time", tax_behavior: "inclusive" } };
const charge = { id: "ch_fixture", paid: true, captured: true, refunded: false, amount_refunded: 0, disputed: false, amount: 2000, currency: "eur" };
let returnedSession = structuredClone(session);
let returnedItem = structuredClone(item);
let returnedCharge = structuredClone(charge);
let intentStatus = "succeeded";
let amountReceived = 2000;
let extraItems = false;
let invoiceUpdate: unknown;

before(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_fixture";
  const stripe = getPurchaseStripe();
  mock.method(stripe.checkout.sessions, "retrieve", async () => returnedSession);
  mock.method(stripe.checkout.sessions, "listLineItems", async () => ({ has_more: extraItems, data: [returnedItem] }));
  mock.method(stripe.paymentIntents, "retrieve", async () => ({ status: intentStatus, amount_received: amountReceived, currency: "eur", latest_charge: returnedCharge }));
  mock.method(stripe.invoices, "update", async (_id: string, data: unknown) => { invoiceUpdate = data; return {}; });
});

describe("paid purchase fulfillment verification", () => {
  it("accepts only matching, captured business purchases", async () => {
    assert.equal((await getPaidPurchaseSession(session.id))?.id, session.id);
    returnedItem.price.id = "price_other";
    assert.equal(await getPaidPurchaseSession(session.id), null);
    returnedItem = structuredClone(item);
    extraItems = true;
    assert.equal(await getPaidPurchaseSession(session.id), null);
    extraItems = false;
    returnedSession.payment_status = "unpaid";
    assert.equal(await getPaidPurchaseSession(session.id), null);
    returnedSession = structuredClone(session);
    returnedSession.customer_details.business_name = "";
    assert.equal(await getPaidPurchaseSession(session.id), null);
    returnedSession = structuredClone(session);
  });

  it("rejects incorrect amounts, incomplete payment, refunds and disputes before delivery", async () => {
    amountReceived = 1999;
    assert.equal(await getPaidPurchaseSession(session.id), null);
    amountReceived = 2000;
    intentStatus = "processing";
    assert.equal(await getPaidPurchaseSession(session.id), null);
    intentStatus = "succeeded";
    for (const update of [{ captured: false }, { paid: false }, { amount: 1999 }, { currency: "usd" }, { amount_refunded: 1 }, { disputed: true }]) {
      returnedCharge = { ...charge, ...update };
      assert.equal(await getPaidPurchaseSession(session.id), null);
    }
    returnedCharge = structuredClone(charge);
    assert.ok(await getPaidPurchaseSession(session.id));
  });

  it("adds the license and purchase-recovery link to the paid invoice", async () => {
    process.env.INDIVIDUAL_DELIVERY_NOTIFICATION = "stripe_invoice";
    await sendPurchaseDeliveryEmail(session as never, "FSI-TEST-CODE");
    assert.deepEqual((invoiceUpdate as { custom_fields: unknown }).custom_fields, [
      { name: "FlowSight local license", value: "FSI-TEST-CODE" },
      { name: "Installers and purchase recovery", value: "https://solo.flowsight.site/purchase/recover" },
    ]);
    await assert.rejects(sendPurchaseDeliveryEmail({ ...session, invoice: null } as never, "FSI-TEST-CODE"), /invoice is unavailable/);
  });
});
