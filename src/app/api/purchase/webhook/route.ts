import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  BULK_LOCAL_PURCHASE_KIND,
  INDIVIDUAL_PURCHASE_KIND,
  isPaidBulkSession,
  isPaidIndividualSession,
} from "@/lib/individual-purchase";
import { ensureBulkLicenses, ensureIndividualLicense } from "@/lib/individual-license.server";
import { getPaidPurchaseSession, getPurchaseStripe, sendBulkDeliveryEmail, sendPurchaseDeliveryEmail } from "@/lib/individual-purchase.server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_INDIVIDUAL_WEBHOOK_SECRET?.trim();
  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = getPurchaseStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const purchaseKind = session.metadata?.purchaseKind;
  if (purchaseKind !== INDIVIDUAL_PURCHASE_KIND && purchaseKind !== BULK_LOCAL_PURCHASE_KIND) {
    return NextResponse.json({ received: true });
  }
  if (purchaseKind === INDIVIDUAL_PURCHASE_KIND && !isPaidIndividualSession(session)) {
    return NextResponse.json({ received: true });
  }
  if (purchaseKind === BULK_LOCAL_PURCHASE_KIND && !isPaidBulkSession(session)) {
    return NextResponse.json({ received: true });
  }

  try {
    const verifiedSession = await getPaidPurchaseSession(session.id);
    if (!verifiedSession) throw new Error("Stripe purchase could not be verified for license delivery");
    if (purchaseKind === BULK_LOCAL_PURCHASE_KIND) {
      const codes = await ensureBulkLicenses(verifiedSession);
      await sendBulkDeliveryEmail(verifiedSession, codes.length);
    } else {
      const licenseCode = await ensureIndividualLicense(verifiedSession);
      await sendPurchaseDeliveryEmail(verifiedSession, licenseCode);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Individual purchase delivery email failed:", error);
    return NextResponse.json({ error: "Delivery email could not be sent." }, { status: 500 });
  }
}
