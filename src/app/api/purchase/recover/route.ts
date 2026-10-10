import { NextResponse } from "next/server";
import { getPurchaseStripe } from "@/lib/individual-purchase.server";
import { absoluteUrl } from "@/lib/site";

export async function POST(request: Request) {
  const fail = () => NextResponse.redirect(absoluteUrl("/purchase/recover?error=invalid"), 303);
  if (request.headers.get("origin") !== new URL(absoluteUrl("/")).origin) return fail();
  const raw = await request.text();
  if (raw.length > 2048) return fail();
  const form = new URLSearchParams(raw);
  const number = form.get("invoiceNumber")?.trim() ?? "";
  const email = form.get("email")?.trim().toLowerCase() ?? "";
  if (!/^[A-Za-z0-9-]{3,64}$/.test(number) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return fail();
  try {
    const stripe = getPurchaseStripe();
    const customers = await stripe.customers.list({ email, limit: 10 });
    for (const customer of customers.data) {
      const invoices = await stripe.invoices.list({ customer: customer.id, status: "paid", limit: 100 });
      const invoice = invoices.data.find((item) => item.number === number && item.customer_email?.toLowerCase() === email);
      if (!invoice) continue;
      const sessions = await stripe.checkout.sessions.list({ customer: customer.id, limit: 100 });
      const session = sessions.data.find((item) => (typeof item.invoice === "string" ? item.invoice : item.invoice?.id) === invoice.id && item.metadata?.purchaseKind === "individual_local");
      if (session) return NextResponse.redirect(absoluteUrl(`/purchase/success?session_id=${encodeURIComponent(session.id)}`), 303);
    }
    return fail();
  } catch {
    return fail();
  }
}
