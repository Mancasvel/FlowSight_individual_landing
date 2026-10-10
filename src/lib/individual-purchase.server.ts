import "server-only";

import { GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resend } from "resend";
import Stripe from "stripe";
import { absoluteUrl } from "@/lib/site";
import { bulkDeliveryTokenForSession } from "@/lib/individual-license";
import {
  BULK_PRICE_CENTS,
  INDIVIDUAL_PRICE_CENTS,
  type PurchaseAsset,
  configuredPurchaseAssets,
  getPurchaseStorageConfig,
  isPaidBulkSession,
  isPaidLocalPurchaseSession,
  isValidBulkLineItem,
  isValidIndividualLineItem,
  isUsablePurchaseCharge,
  isValidBulkPrice,
  isValidIndividualPrice,
} from "@/lib/individual-purchase";

let stripeClient: Stripe | undefined;

export function getPurchaseStripe(): Stripe {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key || !/^sk_(?:test|live)_/.test(key)) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (process.env.NODE_ENV === "production" && !key.startsWith("sk_live_")) {
    throw new Error("A live Stripe key is required in production");
  }
  stripeClient = new Stripe(key);
  return stripeClient;
}

function getStorageClient() {
  const config = getPurchaseStorageConfig();
  return {
    config,
    client: new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    }),
  };
}

export async function assertOneTimePrice(priceId: string, tier: "individual" | "bulk") {
  if (!/^price_[A-Za-z0-9]+$/.test(priceId)) {
    throw new Error(`The ${tier} Stripe Price ID is invalid`);
  }
  const price = await getPurchaseStripe().prices.retrieve(priceId);
  const expectedCents = tier === "bulk" ? BULK_PRICE_CENTS : INDIVIDUAL_PRICE_CENTS;
  const valid = tier === "bulk" ? isValidBulkPrice(price) : isValidIndividualPrice(price);
  if (!valid) {
    throw new Error(`${tier} Stripe price must be active, one-time, EUR ${expectedCents / 100} per license, and tax-inclusive`);
  }
}

export async function assertPurchaseAssetsExist() {
  if (process.env.INDIVIDUAL_INSTALLER_DELIVERY === "github") {
    await Promise.all(configuredPurchaseAssets().map(async (asset) => {
      const response = await fetch(asset.url!, { method: "HEAD", signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`Official ${asset.label} installer is unavailable`);
    }));
    return;
  }
  const { config, client } = getStorageClient();
  try {
    await Promise.all(config.assets.map((asset) => client.send(new HeadObjectCommand({
      Bucket: config.bucket,
      Key: asset.objectKey,
    }))));
  } finally {
    client.destroy();
  }
}

export async function getPaidPurchaseSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  const stripe = getPurchaseStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!isPaidLocalPurchaseSession(session) || !session.payment_intent) return null;

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 2 });
  if (lineItems.has_more || lineItems.data.length !== 1) return null;
  const validItem = isPaidBulkSession(session)
    ? isValidBulkLineItem(lineItems.data[0], session.metadata)
    : isValidIndividualLineItem(lineItems.data[0], session);
  if (!validItem) return null;

  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent.id;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  });
  if (paymentIntent.status !== "succeeded" || !paymentIntent.latest_charge) return null;
  if (paymentIntent.amount_received !== session.amount_total || paymentIntent.currency !== "eur") return null;

  const charge = typeof paymentIntent.latest_charge === "string"
    ? await stripe.charges.retrieve(paymentIntent.latest_charge)
    : paymentIntent.latest_charge;
  if (!charge.paid || !charge.captured || !isUsablePurchaseCharge(charge)) return null;
  if (charge.amount !== session.amount_total || charge.currency !== "eur") return null;
  return session;
}

export async function signedPurchaseAssetUrl(asset: PurchaseAsset): Promise<string> {
  if (process.env.INDIVIDUAL_INSTALLER_DELIVERY === "github" && asset.url) return asset.url;
  const { config, client } = getStorageClient();
  try {
    return await getSignedUrl(client, new GetObjectCommand({
      Bucket: config.bucket,
      Key: asset.objectKey,
    }), { expiresIn: 600 });
  } finally {
    client.destroy();
  }
}

export async function sendPurchaseDeliveryEmail(session: Stripe.Checkout.Session, licenseCode: string) {
  if (process.env.INDIVIDUAL_DELIVERY_NOTIFICATION === "stripe_invoice") {
    if (!session.invoice) throw new Error("Stripe purchase invoice is unavailable");
    const invoiceId = typeof session.invoice === "string" ? session.invoice : session.invoice.id;
    await getPurchaseStripe().invoices.update(invoiceId, {
      custom_fields: [
        { name: "FlowSight local license", value: licenseCode },
        { name: "Installers and purchase recovery", value: absoluteUrl("/purchase/recover") },
      ],
      footer: "Official local edition for business use. One active computer per operating system. Local updates included. Optional cloud plans are separate. Keep this invoice to recover your purchase.",
    });
    return;
  }
  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) throw new Error("Stripe did not provide a purchase email");
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) throw new Error("RESEND_FROM_EMAIL is not configured");
  const deliveryUrl = absoluteUrl(`/purchase/success?session_id=${encodeURIComponent(session.id)}`);
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject: "Your FlowSight Individual download",
    html: `<p>Thank you for buying FlowSight Individual.</p><p>One purchase covers one active Windows computer, one Mac and one Linux computer, with local updates. Your local-edition license code is <strong>${licenseCode}</strong>. It is separate from an Individual Pro cloud license.</p><p><a href="${deliveryUrl}">Open your private download page</a> to choose an installer. After installing, open Settings → Individual local license in the app and enter the code. Keep this email so you can return later.</p><p>The source code remains available under AGPL-3.0. Optional cloud plans are separate.</p>`,
    text: `Thank you for buying FlowSight Individual. One purchase covers one active Windows computer, one Mac and one Linux computer, with local updates. Your local-edition license code is ${licenseCode}. It is separate from an Individual Pro cloud license. Open your private download page: ${deliveryUrl}\n\nAfter installing, open Settings → Individual local license in the app and enter the code. Keep this email so you can return later. The source code remains available under AGPL-3.0. Optional cloud plans are separate.`,
  }, { idempotencyKey: `individual-delivery-${session.id}` });
  if (error) throw new Error(`Purchase delivery email failed: ${error.message}`);
}

export async function sendBulkDeliveryEmail(session: Stripe.Checkout.Session, seatCount: number) {
  if (!isPaidBulkSession(session) || Number(session.metadata?.seatCount) !== seatCount) {
    throw new Error("A verified institutional purchase is required before delivery");
  }
  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) throw new Error("Stripe did not provide a purchase email");
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!key || !from) throw new Error("Institutional purchase email is not configured");
  const deliveryToken = bulkDeliveryTokenForSession(session.id, process.env.INDIVIDUAL_LICENSE_SECRET?.trim() ?? "");
  const deliveryUrl = absoluteUrl(`/organizations/purchase/success?session_id=${encodeURIComponent(session.id)}&access=${encodeURIComponent(deliveryToken)}`);
  const htmlDeliveryUrl = deliveryUrl.replaceAll("&", "&amp;");
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: [email],
    subject: `Your ${seatCount} FlowSight Solo licenses`,
    html: `<p>Thank you for buying ${seatCount} FlowSight Individual official-installer licenses.</p><p><a href="${htmlDeliveryUrl}">Open your private delivery page</a> to download the license CSV, the installers and your organization overview. Each code is for one person and covers one active Windows computer, one Mac and one Linux computer, with local updates. Give each participant one code and ask them to keep it private.</p><p>The overview shows only the total number of activated codes; it does not list a student's activation, focus sessions, apps, progress or results. Keep this email private: the link gives access to all ${seatCount} codes. These are local-edition licenses; optional cloud plans are separate. The FlowSight source remains available under AGPL-3.0.</p>`,
    text: `Thank you for buying ${seatCount} FlowSight Individual official-installer licenses. Open your private delivery page to download the license CSV and installers and see your organization overview: ${deliveryUrl}\n\nEach code is for one person and covers one active Windows computer, one Mac and one Linux computer, with local updates. Give each participant one code and ask them to keep it private. The overview shows only the total number of activated codes; it does not list a student's activation, focus sessions, apps, progress or results. Keep this email private: the link gives access to all ${seatCount} codes. These are local-edition licenses; optional cloud plans are separate. The FlowSight source remains available under AGPL-3.0.`,
  }, { idempotencyKey: `bulk-delivery-${session.id}` });
  if (error) throw new Error(`Institutional delivery email failed: ${error.message}`);
}
