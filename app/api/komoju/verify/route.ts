import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  const secretKey = process.env.KOMOJU_SECRET_KEY;
  if (!secretKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const res = await fetch(`https://komoju.com/api/v1/sessions/${sessionId}`, {
    headers: { Authorization: "Basic " + Buffer.from(secretKey + ":").toString("base64") },
  });
  const data = await res.json();
  if (!res.ok || data.status !== "completed") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set("premium", "1", { httpOnly: true, maxAge: 60 * 60 * 24 * 365, path: "/" });
  return response;
}

export async function POST(req: NextRequest) {
  return GET(req);
}
