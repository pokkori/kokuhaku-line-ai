import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("x-komoju-signature") || "";
  const webhookSecret = process.env.KOMOJU_WEBHOOK_SECRET;

  if (webhookSecret && sig) {
    const expected = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
    if (expected !== sig) {
      console.error("Komoju webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const event = JSON.parse(body);
  console.log("Komoju webhook received:", event.type, event.data?.object?.id);

  switch (event.type) {
    case "payment.captured":
      console.log("Payment captured:", event.data?.object?.id);
      break;
    case "payment.failed":
      console.log("Payment failed:", event.data?.object?.id);
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
