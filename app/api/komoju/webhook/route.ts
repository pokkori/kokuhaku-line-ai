import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("x-komoju-signature") || "";
  const secret = process.env.KOMOJU_WEBHOOK_SECRET || process.env.KOMOJU_SECRET_KEY || "";
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (sig !== expected) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  return NextResponse.json({ received: true });
}
