import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const FREE_LIMIT = 3;

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const isPremium = cookieStore.get("stripe_premium")?.value === "1";

  let usedCount = 0;
  if (!isPremium) {
    usedCount = parseInt(cookieStore.get("free_uses")?.value ?? "0", 10);
    if (usedCount >= FREE_LIMIT) {
      return NextResponse.json({ error: "無料回数を使い切りました" }, { status: 402 });
    }
  }

  const { message, context } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "LINEの内容を入力してください" }, { status: 400 });
  }

  const prompt = `あなたは恋愛心理の専門AIです。以下のLINEの会話内容を分析して、送信者（彼）の気持ちと脈あり度を診断してください。

【LINEの内容】
${message}

${context ? `【補足情報】\n${context}` : ""}

以下の形式で必ず回答してください：

===SCORE===
[脈あり度を0〜100の数値のみで記載。例：73]

===ANALYSIS===
[相手の心理・気持ちの分析を200〜300文字で記載。具体的な根拠（言葉の選び方・返信のタイミング・文体など）を挙げること]

===REPLY===
[返信例文1：積極的に気持ちを伝えるアプローチ型の返信（1〜2文）]
---
[返信例文2：自然体で関係を深める型の返信（1〜2文）]
---
[返信例文3：距離感を保ちながら様子を見る型の返信（1〜2文）]

===ADVICE===
[今の関係をどう発展させるか、次にとるべきアクションを具体的に150〜200文字で記載]`;

  try {
    const anthropic = getAnthropic();
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const result = (response.content[0] as { text: string }).text;

    const res = NextResponse.json({
      result,
      remaining: isPremium ? null : FREE_LIMIT - (usedCount + 1),
    });

    if (!isPremium) {
      res.cookies.set("free_uses", String(usedCount + 1), {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return res;
  } catch {
    return NextResponse.json({ error: "AI分析中にエラーが発生しました" }, { status: 500 });
  }
}
