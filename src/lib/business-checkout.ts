import type Stripe from "stripe";
import { BUSINESS_BUYER_POLICY, INDIVIDUAL_PURCHASE_KIND } from "./individual-purchase";

export type BusinessCheckoutInput = { businessName: string; businessTaxId: string };

export function parseBusinessCheckoutInput(fields: { get(name: string): unknown }): BusinessCheckoutInput | null {
  const name = fields.get("businessName");
  const taxId = fields.get("businessTaxId");
  if (fields.get("businessDeclared") !== "true" || typeof name !== "string" || typeof taxId !== "string") return null;
  const businessName = name.trim();
  const businessTaxId = taxId.trim();
  if (businessName.length < 2 || businessName.length > 150 || businessTaxId.length < 3 || businessTaxId.length > 64 ||
      /[\p{Cc}\p{Cf}<>]/u.test(businessName + businessTaxId)) return null;
  return { businessName, businessTaxId };
}

/** Hosted Checkout requires the same professional declaration as the landing. */
export function businessCheckoutParams(
  priceId: string,
  siteUrl: string,
  buyer: BusinessCheckoutInput,
): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_creation: "always",
    billing_address_collection: "required",
    name_collection: { business: { enabled: true, optional: false } },
    tax_id_collection: { enabled: true, required: "if_supported" },
    automatic_tax: { enabled: true },
    invoice_creation: { enabled: true, invoice_data: {
      custom_fields: [{ name: "Installers and purchase recovery", value: `${siteUrl}/purchase/recover` }],
      description: "FlowSight Solo official local edition — one-time business purchase",
    } },
    success_url: `${siteUrl}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/?checkout=canceled#offer`,
    metadata: {
      purchaseKind: INDIVIDUAL_PURCHASE_KIND,
      priceId,
      buyerPolicy: BUSINESS_BUYER_POLICY,
      businessDeclared: "true",
    },
    custom_fields: [
      {
        key: "businessid", label: { type: "custom", custom: "Business tax or registration ID" }, type: "text", optional: false,
        text: { minimum_length: 3, maximum_length: 64, default_value: buyer.businessTaxId },
      },
      {
        key: "businesspurchase", label: { type: "custom", custom: "I am buying for my business" }, type: "dropdown", optional: false,
        dropdown: { options: [{ label: "Company or self-employed: professional use", value: "business" }] },
      },
    ],
    custom_text: {
      submit: { message: "For companies and self-employed professionals only, in any country. EUR 20 total, paid once, including applicable tax. Enter your legal business name and billing details. One active computer per operating system; optional cloud plans are separate." },
    },
  };
}
