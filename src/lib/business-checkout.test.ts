import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { businessCheckoutParams, parseBusinessCheckoutInput } from "./business-checkout";

describe("business purchase admission and Stripe configuration", () => {
  it("rejects bypasses, empty identities and unsafe inputs before opening Stripe", () => {
    const fields = new URLSearchParams({ businessName: "  Estudio Álvarez  ", businessTaxId: "EXAMPLE123", businessDeclared: "true" });
    assert.deepEqual(parseBusinessCheckoutInput(fields), { businessName: "Estudio Álvarez", businessTaxId: "EXAMPLE123" });
    for (const [key, value] of [["businessDeclared", "false"], ["businessName", ""], ["businessTaxId", ""], ["businessTaxId", "x".repeat(65)], ["businessName", "<script>test</script>"], ["businessName", "a\ncompany"]]) {
      const invalid = new URLSearchParams(fields);
      invalid.set(key, value);
      assert.equal(parseBusinessCheckoutInput(invalid), null, `${key} should reject invalid input`);
    }
  });

  it("requires business information inside hosted Stripe Checkout and preserves the stated final price", () => {
    const params = businessCheckoutParams("price_current", "https://solo.flowsight.site", { businessName: "Example", businessTaxId: "EXAMPLE123" });
    assert.equal(params.mode, "payment");
    assert.deepEqual(params.line_items, [{ price: "price_current", quantity: 1 }]);
    assert.deepEqual(params.name_collection?.business, { enabled: true, optional: false });
    assert.deepEqual(params.tax_id_collection, { enabled: true, required: "if_supported" });
    assert.equal(params.billing_address_collection, "required");
    assert.equal(params.automatic_tax?.enabled, true);
    assert.equal(params.invoice_creation?.enabled, true);
    assert.equal(params.metadata?.businessDeclared, "true");
    assert.equal(params.metadata?.priceId, "price_current");
    assert.equal(params.custom_fields?.[0].text?.default_value, "EXAMPLE123");
    assert.equal(params.custom_fields?.[1].optional, false);
    assert.deepEqual(params.custom_fields?.[1].dropdown?.options.map((option) => option.value), ["business"]);
    assert.equal(params.success_url, "https://solo.flowsight.site/purchase/success?session_id={CHECKOUT_SESSION_ID}");
    const submitText = params.custom_text?.submit;
    assert.match(submitText && typeof submitText === "object" ? submitText.message : "", /EUR 20 total/);
  });
});
