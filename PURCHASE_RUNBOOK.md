# FlowSight Solo business purchase

The official local edition costs EUR 20 once, tax-inclusive. Companies and self-employed professionals may buy in any country. Consumers are excluded. This commercial policy does not remove the seller's IRPF obligations, and business tax-ID collection is not proof of an income-tax exemption.

## Stripe

- Existing live Solo product: `prod_VLTApBdf18pRTc`.
- New price: `price_1UP29e821urN8W6Z0E0qZyZV`, EUR 2000 cents, one-time, inclusive. Prior prices remain active for existing purchases.
- Dedicated webhook: `we_1UP2CX821urN8W6ZSKpvqHJM` at `https://solo.flowsight.site/api/purchase/webhook`.
- Checkout collects legal business name, fiscal/registration ID, full billing address, country, supported business tax IDs and a required business-use declaration. Stripe Tax calculates applicable VAT; no blanket tax exemption is set.
- The account has charges enabled. The seller's legal name, NIF and fiscal address must be completed accurately in Stripe's invoice settings; never invent them.

## Vercel and protected credentials

Stripe and Supabase service secrets already exist as protected variables in `flow-sight-landing` and cannot be exported. Purchase-server code is deployed there without replacing its public custom-domain deployment. The Solo project proxies only purchase/license/install routes to an immutable deployment using a server-only Vercel protection bypass token. The public pages and domain remain in `flowsight-individual`.

`INDIVIDUAL_PURCHASE_SERVICE_URL` must point to the verified purchase-service deployment. `INDIVIDUAL_PURCHASE_SERVICE_ACCESS` stays sensitive. Do not use the main project's moving deployment alias, and do not promote purchase-service code to its public marketing domains. Service pages use the Solo public origin for checkout returns and recovery.

## Delivery and licenses

- `INDIVIDUAL_LICENSE_BACKEND=supabase_storage`: private bucket `flowsight-solo-licenses`; only server service credentials read/write records.
- Idempotent session/payment/code objects register the purchase. Atomic create-only operation locks serialize each license/platform slot. A crashed operation fails closed and leaves a lock for support to inspect; never remove an active lock blindly.
- `INDIVIDUAL_INSTALLER_DELIVERY=github`: allowlisted official release assets; all five installer variants are checked before checkout. Current Windows version is 6.1.0; macOS/Linux are 5.0.18. Public historical assets and updater access remain available. This sells the official distribution and local license, not exclusive access to AGPL source.
- `INDIVIDUAL_DELIVERY_NOTIFICATION=stripe_invoice`: invoice includes purchase recovery URL, and the webhook adds the FSI code. Success page provides immediate license/downloads. Recovery asks for invoice number and buyer email; `/install` accepts the FSI code. Invoice email delivery depends on the account's Stripe email settings.
- Optional monthly cloud plans are separate.

The payment verifier checks paid Checkout mode, EUR amount, actual single line item and price ID, successful captured payment intent/charge, refund/dispute status, and business declaration before issuing a new EUR 20 license. Earlier EUR 10 and EUR 25 individual purchases keep access without the new business policy.

## Verification and support

Run `pnpm test:purchase`, `pnpm lint`, `pnpm typecheck`, `pnpm build`. `scripts/audit-business-purchase.mjs` verifies required fields, accessibility and optional Checkout redirect without charging. `scripts/audit-purchase.mjs` checks unverified delivery links. The protected `/api/purchase/readiness` requires `INDIVIDUAL_SETUP_ACCESS`; `?verifyStorage=true` creates and immediately removes a synthetic storage probe. Do not put access tokens or license links in public release notes.

Record deployment IDs, checks and limitations in private technical logs. Real end-to-end paid delivery must be distinguished from unit tests, synthetic storage probes and opening an unpaid live Checkout. Do not claim a real payment was tested unless it was.
