export const INDIVIDUAL_PURCHASE_KIND = "individual_local";
export const BULK_LOCAL_PURCHASE_KIND = "organization_bulk_local";
export const PREVIOUS_INDIVIDUAL_PRICE_CENTS = 1_000;
export const PREVIOUS_OFFER_PRICE_CENTS = 2_500;
export const INDIVIDUAL_PRICE_CENTS = 2_000;
export const INDIVIDUAL_PRICE_EUROS = INDIVIDUAL_PRICE_CENTS / 100;
export const BUSINESS_BUYER_POLICY = "business_only_v1";
// Institutional pricing is a separate offer and keeps its existing rates.
export const INSTITUTIONAL_PRICE_CENTS = 2_500;
export const BULK_PRICE_CENTS = 1_000;
export const BULK_DISCOUNT_MIN_SEATS = 100;
export const INDIVIDUAL_TAX_BEHAVIOR = "inclusive";
export const BULK_MIN_SEATS = 2;
export const BULK_MAX_SEATS = 500;

export function bulkUnitPriceCents(seats: number): number {
  return seats >= BULK_DISCOUNT_MIN_SEATS ? BULK_PRICE_CENTS : INSTITUTIONAL_PRICE_CENTS;
}

export function parseBulkSeatCount(value: unknown): number | null {
  if (typeof value !== "string" || !/^[1-9][0-9]{0,2}$/.test(value)) return null;
  const count = Number(value);
  return count >= BULK_MIN_SEATS && count <= BULK_MAX_SEATS ? count : null;
}

export const platformDefinitions = [
  { id: "windows", label: "Windows", objectKeyEnv: "INDIVIDUAL_WINDOWS_OBJECT_KEY", extension: ".exe" },
  { id: "mac-arm", label: "macOS (Apple Silicon)", objectKeyEnv: "INDIVIDUAL_MAC_ARM_OBJECT_KEY", extension: ".dmg" },
  { id: "mac-intel", label: "macOS (Intel)", objectKeyEnv: "INDIVIDUAL_MAC_INTEL_OBJECT_KEY", extension: ".dmg" },
  { id: "linux-deb", label: "Linux (.deb)", objectKeyEnv: "INDIVIDUAL_LINUX_DEB_OBJECT_KEY", extension: ".deb" },
  { id: "linux-appimage", label: "Linux (AppImage)", objectKeyEnv: "INDIVIDUAL_LINUX_APPIMAGE_OBJECT_KEY", extension: ".AppImage" },
] as const;

export type PurchasePlatform = (typeof platformDefinitions)[number]["id"];
export type PurchaseEnvironment = Record<string, string | undefined>;
export type PurchaseAsset = {
  id: PurchasePlatform;
  label: string;
  objectKey: string;
  filename: string;
  url?: string;
};

function required(env: PurchaseEnvironment, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function configuredPurchaseAssets(env: PurchaseEnvironment = process.env): PurchaseAsset[] {
  return platformDefinitions.flatMap((platform) => {
    if (env.INDIVIDUAL_INSTALLER_DELIVERY === "github") {
      const url = env[platform.objectKeyEnv.replace("OBJECT_KEY", "RELEASE_URL")]?.trim();
      if (!url) return [];
      const match = /^https:\/\/github\.com\/Mancasvel\/(FlowSight\.AI|FlowSight_Mac|FlowSight_linux)\/releases\/download\/v\d+\.\d+\.\d+\/([A-Za-z0-9._-]+)$/.exec(url);
      const expectedRepo = platform.id === "windows" ? "FlowSight.AI" : platform.id.startsWith("mac-") ? "FlowSight_Mac" : "FlowSight_linux";
      if (!match || match[1] !== expectedRepo || !match[2].endsWith(platform.extension)) throw new Error("Installer must be an official FlowSight release artifact");
      return [{ id: platform.id, label: platform.label, objectKey: "", filename: match[2], url }];
    }
    const objectKey = env[platform.objectKeyEnv]?.trim();
    if (!objectKey) return [];
    const filename = objectKey.split("/").at(-1) ?? "";
    if (
      objectKey.startsWith("/") ||
      objectKey.includes("..") ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(filename) ||
      !filename.endsWith(platform.extension)
    ) {
      throw new Error(`${platform.objectKeyEnv} must point to a safe ${platform.extension} object`);
    }
    return [{ id: platform.id, label: platform.label, objectKey, filename }];
  });
}

export function purchaseAssetForPlatform(
  platform: string | null,
  env: PurchaseEnvironment = process.env,
): PurchaseAsset | undefined {
  return configuredPurchaseAssets(env).find((asset) => asset.id === platform);
}

export function getPurchaseStorageConfig(env: PurchaseEnvironment = process.env) {
  const accountId = required(env, "R2_ACCOUNT_ID");
  if (!/^[a-fA-F0-9]{32}$/.test(accountId)) {
    throw new Error("R2_ACCOUNT_ID must be a Cloudflare account ID");
  }
  const assets = configuredPurchaseAssets(env);
  if (assets.length === 0) throw new Error("No Individual installer objects are configured");
  return {
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    accessKeyId: required(env, "R2_ACCESS_KEY_ID"),
    secretAccessKey: required(env, "R2_SECRET_ACCESS_KEY"),
    bucket: required(env, "R2_BUCKET"),
    assets,
  };
}

export function getPurchaseCheckoutConfig(env: PurchaseEnvironment = process.env) {
  if (env.INDIVIDUAL_CHECKOUT_ENABLED !== "true") {
    throw new Error("Individual checkout is disabled");
  }
  const stripeKey = required(env, "STRIPE_SECRET_KEY");
  if (!/^sk_(?:test|live)_/.test(stripeKey) || (env.NODE_ENV === "production" && !stripeKey.startsWith("sk_live_"))) {
    throw new Error("STRIPE_SECRET_KEY must be a valid key for this environment");
  }
  const taxBehavior = required(env, "INDIVIDUAL_TAX_BEHAVIOR");
  if (taxBehavior !== INDIVIDUAL_TAX_BEHAVIOR) {
    throw new Error("INDIVIDUAL_TAX_BEHAVIOR must be inclusive so the buyer pays the stated total");
  }
  required(env, "STRIPE_INDIVIDUAL_WEBHOOK_SECRET");
  if (env.INDIVIDUAL_DELIVERY_NOTIFICATION !== "stripe_invoice") {
    required(env, "RESEND_API_KEY");
    required(env, "RESEND_FROM_EMAIL");
  }
  const licenseSecret = required(env, "INDIVIDUAL_LICENSE_SECRET");
  if (!/^[a-fA-F0-9]{64}$/.test(licenseSecret)) {
    throw new Error("INDIVIDUAL_LICENSE_SECRET must be a 32-byte hex secret");
  }
  {
    const supabaseUrl = env.SUPABASE_URL?.trim() || required(env, "NEXT_PUBLIC_SUPABASE_URL");
    if (!/^https:\/\/[A-Za-z0-9-]+\.supabase\.co\/?$/.test(supabaseUrl)) {
      throw new Error("SUPABASE_URL must be a Supabase project URL");
    }
    required(env, "SUPABASE_SECRET_KEY");
  }
  const storage = env.INDIVIDUAL_INSTALLER_DELIVERY === "github"
    ? { assets: configuredPurchaseAssets(env) }
    : getPurchaseStorageConfig(env);
  const missingPlatforms = platformDefinitions.filter((platform) => !storage.assets.some((asset) => asset.id === platform.id));
  if (missingPlatforms.length > 0) {
    throw new Error(`All Individual installers must be configured before checkout: ${missingPlatforms.map((platform) => platform.label).join(", ")}`);
  }
  return {
    priceId: required(env, "STRIPE_PRICE_INDIVIDUAL_LOCAL"),
    taxBehavior: INDIVIDUAL_TAX_BEHAVIOR,
    storage,
  };
}

/** Keep purchase CTAs hidden until the complete server-side configuration exists. */
export function isIndividualCheckoutConfigured(env: PurchaseEnvironment = process.env): boolean {
  if (env.INDIVIDUAL_CHECKOUT_ENABLED === "true" && env.INDIVIDUAL_PURCHASE_SERVICE_URL && env.INDIVIDUAL_PURCHASE_SERVICE_ACCESS) {
    return /^https:\/\/flow-sight-landing-[a-z0-9]+-mancasvels-projects\.vercel\.app$/.test(env.INDIVIDUAL_PURCHASE_SERVICE_URL);
  }
  try {
    getPurchaseCheckoutConfig(env);
    return true;
  } catch {
    return false;
  }
}

/** Bulk sales stay behind their own gate as well as every Individual launch gate. */
export function getBulkCheckoutConfig(env: PurchaseEnvironment = process.env) {
  if (env.BULK_CHECKOUT_ENABLED !== "true") {
    throw new Error("Bulk checkout is disabled");
  }
  if (env.INDIVIDUAL_LICENSE_BACKEND === "supabase_storage") throw new Error("Institutional checkout requires the institutional license backend");
  const individualConfig = getPurchaseCheckoutConfig(env);
  const discountedPriceId = required(env, "STRIPE_PRICE_BULK_LOCAL");
  if (discountedPriceId === individualConfig.priceId) {
    throw new Error("STRIPE_PRICE_BULK_LOCAL must differ from STRIPE_PRICE_INDIVIDUAL_LOCAL");
  }
  return {
    ...individualConfig,
    discountedPriceId,
  };
}

export function isBulkCheckoutConfigured(env: PurchaseEnvironment = process.env): boolean {
  try {
    getBulkCheckoutConfig(env);
    return true;
  } catch {
    return false;
  }
}

export function isIndividualSessionId(value: string | null | undefined): value is string {
  return typeof value === "string" && /^cs_(?:test|live)_[A-Za-z0-9]+$/.test(value);
}

export function isValidIndividualPrice(
  price: { active: boolean; currency: string; unit_amount: number | null; type: string; tax_behavior: string | null },
): boolean {
  return price.active &&
    price.currency === "eur" &&
    price.unit_amount === INDIVIDUAL_PRICE_CENTS &&
    price.type === "one_time" &&
    price.tax_behavior === INDIVIDUAL_TAX_BEHAVIOR;
}

export function isValidBulkPrice(
  price: { active: boolean; currency: string; unit_amount: number | null; type: string; tax_behavior: string | null },
): boolean {
  return price.active &&
    price.currency === "eur" &&
    price.unit_amount === BULK_PRICE_CENTS &&
    price.type === "one_time" &&
    price.tax_behavior === INDIVIDUAL_TAX_BEHAVIOR;
}

export function isPaidIndividualSession(session: {
  mode: string | null;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
  metadata: Record<string, string> | null;
  payment_intent: unknown;
  customer_details?: BusinessPurchaseSession["customer_details"];
  collected_information?: BusinessPurchaseSession["collected_information"];
  custom_fields?: BusinessPurchaseSession["custom_fields"];
}): boolean {
  return session.mode === "payment" &&
    session.payment_status === "paid" &&
    (session.amount_total === INDIVIDUAL_PRICE_CENTS || session.amount_total === PREVIOUS_INDIVIDUAL_PRICE_CENTS || session.amount_total === PREVIOUS_OFFER_PRICE_CENTS) &&
    session.currency === "eur" &&
    session.metadata?.purchaseKind === INDIVIDUAL_PURCHASE_KIND &&
    Boolean(session.payment_intent) &&
    (session.amount_total !== INDIVIDUAL_PRICE_CENTS || isEligibleBusinessSession(session));
}

type BusinessPurchaseSession = {
  metadata: Record<string, string> | null;
  customer_details?: { business_name?: string | null; address?: { country: string | null } | null } | null;
  collected_information?: { business_name?: string | null } | null;
  custom_fields?: Array<{ key: string; text?: { value: string | null } | null; dropdown?: { value: string | null } | null }>;
};

/** A declaration and billing identity are required; they are not tax-exemption proof. */
export function isEligibleBusinessSession(session: BusinessPurchaseSession): boolean {
  const businessName = session.customer_details?.business_name ?? session.collected_information?.business_name;
  const country = session.customer_details?.address?.country;
  const taxId = session.custom_fields?.find((field) => field.key === "businessid")?.text?.value;
  const declaration = session.custom_fields?.find((field) => field.key === "businesspurchase")?.dropdown?.value;
  return session.metadata?.buyerPolicy === BUSINESS_BUYER_POLICY &&
    session.metadata?.businessDeclared === "true" &&
    typeof businessName === "string" && businessName.trim().length >= 2 &&
    typeof country === "string" && /^[A-Z]{2}$/.test(country) &&
    typeof taxId === "string" && taxId.trim().length >= 3 && taxId.trim().length <= 64 &&
    declaration === "business";
}

export function isValidIndividualLineItem(
  item: { quantity: number | null; price: { id: string; currency: string; unit_amount: number | null; type: string; tax_behavior: string | null } | null },
  session: { amount_total: number | null; metadata: Record<string, string> | null },
): boolean {
  if (!item.price || item.quantity !== 1 || item.price.currency !== "eur" || item.price.type !== "one_time" || item.price.unit_amount !== session.amount_total) return false;
  if (session.amount_total === INDIVIDUAL_PRICE_CENTS) {
    return item.price.id === session.metadata?.priceId && item.price.tax_behavior === INDIVIDUAL_TAX_BEHAVIOR;
  }
  return session.amount_total === PREVIOUS_INDIVIDUAL_PRICE_CENTS || session.amount_total === PREVIOUS_OFFER_PRICE_CENTS;
}

export function isPaidBulkSession(session: {
  mode: string | null;
  payment_status: string;
  amount_total: number | null;
  currency: string | null;
  metadata: Record<string, string> | null;
  payment_intent: unknown;
}): boolean {
  const seats = parseBulkSeatCount(session.metadata?.seatCount);
  return seats !== null &&
    session.mode === "payment" &&
    session.payment_status === "paid" &&
    session.amount_total === seats * bulkUnitPriceCents(seats) &&
    session.currency === "eur" &&
    session.metadata?.purchaseKind === BULK_LOCAL_PURCHASE_KIND &&
    /^price_[A-Za-z0-9]+$/.test(session.metadata?.priceId ?? "") &&
    Boolean(session.payment_intent);
}

/** Stripe line items are checked separately from trusted session metadata. */
export function isValidBulkLineItem(
  item: {
    quantity: number | null;
    price: {
      id: string;
      currency: string;
      unit_amount: number | null;
      type: string;
      tax_behavior: string | null;
    } | null;
  },
  metadata: Record<string, string> | null,
): boolean {
  const seats = parseBulkSeatCount(metadata?.seatCount);
  return seats !== null &&
    item.price !== null &&
    item.quantity === seats &&
    item.price.id === metadata?.priceId &&
    item.price.currency === "eur" &&
    item.price.unit_amount === bulkUnitPriceCents(seats) &&
    item.price.type === "one_time" &&
    item.price.tax_behavior === INDIVIDUAL_TAX_BEHAVIOR;
}

export function isPaidLocalPurchaseSession(session: Parameters<typeof isPaidIndividualSession>[0]): boolean {
  return isPaidIndividualSession(session) || isPaidBulkSession(session);
}

export function isUsablePurchaseCharge(charge: {
  refunded: boolean;
  amount_refunded: number;
  disputed: boolean;
}): boolean {
  return !charge.refunded && charge.amount_refunded === 0 && !charge.disputed;
}
