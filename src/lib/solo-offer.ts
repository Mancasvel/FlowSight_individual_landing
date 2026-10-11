import { INDIVIDUAL_PRICE_CENTS, isIndividualCheckoutConfigured, type PurchaseEnvironment } from "./individual-purchase";

export const SOLO_OFFER_PRICE_EUROS = 25;

/** The new landing must not open the existing EUR 20 checkout under a EUR 25 offer. */
export function isSoloOfferCheckoutConfigured(env: PurchaseEnvironment = process.env): boolean {
  return INDIVIDUAL_PRICE_CENTS / 100 === SOLO_OFFER_PRICE_EUROS && isIndividualCheckoutConfigured(env);
}
