import assert from "node:assert/strict";
import test from "node:test";
import { isIndividualCheckoutConfigured } from "./individual-purchase";
import { isSoloOfferCheckoutConfigured } from "./solo-offer";

test("the new offer stays closed even when the existing EUR 20 purchase service is configured", () => {
  const environment = {
    INDIVIDUAL_CHECKOUT_ENABLED: "true",
    INDIVIDUAL_PURCHASE_SERVICE_URL: "https://flow-sight-landing-offercheck-mancasvels-projects.vercel.app",
    INDIVIDUAL_PURCHASE_SERVICE_ACCESS: "local-test-fixture",
  };
  assert.equal(isIndividualCheckoutConfigured(environment), true);
  assert.equal(isSoloOfferCheckoutConfigured(environment), false);
});
