import { NextRequest, NextResponse } from "next/server";

const PLANS: Record<string, { amount: number; currency: string; name: string }> = {
  standard: { amount: 980, currency: "JPY", name: "スタンダードプラン" },
};

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();
    const plan = PLANS[planId];
    if (!plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const secretKey = process.env.KOMOJU_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Komoju not configured" }, { status: 500 });

    const origin = req.headers.get("origin") || "https://kokuhaku-line-ai.vercel.app";
    const res = await fetch("https://komoju.com/api/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(secretKey + ":").toString("base64"),
      },
      body: JSON.stringify({
        amount: plan.amount,
        currency: plan.currency,
        default_locale: "ja",
        return_to: `${origin}/success?plan=${planId}`,
        cancel: `${origin}/`,
        line_items: [{ description: plan.name, quantity: 1, unit_price: plan.amount, tax: 0 }],
        metadata: { planId },
      }),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message || "Checkout failed" }, { status: 500 });
    return NextResponse.json({ url: data.payment_url });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
