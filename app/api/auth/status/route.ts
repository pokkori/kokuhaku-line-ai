import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const FREE_LIMIT = 3;

export async function GET() {
  const cookieStore = await cookies();
  const isPremium = cookieStore.get("stripe_premium")?.value === "1";
  const usedCount = parseInt(cookieStore.get("free_uses")?.value ?? "0", 10);
  return NextResponse.json({
    premium: isPremium,
    remaining: isPremium ? null : Math.max(0, FREE_LIMIT - usedCount),
  });
}
