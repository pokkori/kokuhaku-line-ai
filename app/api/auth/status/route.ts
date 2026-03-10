import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const FREE_LIMIT = 3;
const APP_ID = "kokuhaku";

export async function GET() {
  const cookieStore = await cookies();
  const email = cookieStore.get("user_email")?.value;
  const usedCount = parseInt(
    cookieStore.get("free_uses")?.value ?? "0",
    10
  );

  if (email) {
    const active = await isActiveSubscription(email, APP_ID);
    return NextResponse.json({
      premium: active,
      email,
      remaining: active ? null : Math.max(0, FREE_LIMIT - usedCount),
    });
  }

  const isPremium = cookieStore.get("premium")?.value === "1" || cookieStore.get("stripe_premium")?.value === "1";
  return NextResponse.json({
    premium: isPremium,
    remaining: isPremium ? null : Math.max(0, FREE_LIMIT - usedCount),
  });
}
