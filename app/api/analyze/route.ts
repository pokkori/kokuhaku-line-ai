import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { cookies } from "next/headers";
import { rateLimit, getIP } from "@/lib/ratelimit";
import { isActiveSubscription } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const FREE_LIMIT = 3;
const APP_ID = "kokuhaku";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
}

export async function POST(req: NextRequest) {
  const { ok } = rateLimit(getIP(req));
  if (!ok) {
    return NextResponse.json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" }, { status: 429 });
  }

  const cookieStore = await cookies();
  const email = cookieStore.get("user_email")?.value;

  let isPremium = false;
  if (email) {
    isPremium = await isActiveSubscription(email, APP_ID);
  } else {
    isPremium = cookieStore.get("premium")?.value === "1" || cookieStore.get("stripe_premium")?.value === "1";
  }

  let usedCount = 0;
  if (!isPremium) {
    usedCount = parseInt(cookieStore.get("free_uses")?.value ?? "0", 10);
    if (usedCount >= FREE_LIMIT) {
      return NextResponse.json({ error: "無料回数を使い切りました" }, { status: 402 });
    }
  }

  const { line, context } = await req.json();
  if (!line?.trim()) {
    return NextResponse.json({ error: "LINEの内容を入力してください" }, { status: 400 });
  }

  const prompt = `あなたは恋愛心理と対人コミュニケーションの専門家AIです。心理学・行動分析・言語分析の知見をもとに、LINEのやり取りから相手の気持ちを科学的に読み解き、次の一手を具体的にアドバイスします。
回答は自然な日本語で、友人に相談しているような親しみやすいトーンで書いてください。

【LINEの内容】
${line}

${context ? `【関係性・状況】\n${context}` : ""}

以下の形式で必ず回答してください：

===SCORE===
[脈あり度を0〜100の数値のみで記載。例：73]

===ANALYSIS===
相手の心理・気持ちの分析を250〜350文字で記載してください。

【分析の観点（全て言及すること）】
- 言葉の選び方・表現のトーン（距離感・親密度・感情）
- 返信速度・文章量の傾向（積極性・関心度のサイン）
- 絵文字・スタンプの使い方（感情の開放度）
- 質問の有無・話題の広げ方（関係継続への意欲）
- この会話で最も「脈あり」を示す具体的な根拠（1〜2点）
- この会話で「脈なし」または「判断しにくい」部分（正直に）

===REPLIES===
今すぐ送れる返信案を3パターン、それぞれ実際に使えるLINE文として記載してください。

1. 【積極アプローチ】距離を縮める一言（送る前に一息ついて使う用。1〜2文）
2. 【自然な関係深め】会話を自然に続けながら好印象を残す返信（1〜2文）
3. 【余韻残し・次につなぐ】次に会う約束や共通話題につなげる返信（1〜2文）

各パターンに「なぜこの返信が効果的か」を1行で付記してください。

===CONFESSION===
告白文テンプレートを3パターン記載してください。それぞれ自然な日本語で、相手に響くよう具体的に書いてください。

LINE: （LINEで送る告白文。2〜4文。ストレートすぎず、でも気持ちが伝わる文体）
直接: （面と向かって伝える台本。2〜4文。緊張しながらも誠実に伝えるトーン）
電話: （電話での告白台本。2〜4文。声で伝えることを意識した口語体）

===TIMING===
告白のベストタイミングを200〜250文字で記載してください。

【含める内容】
- 「今すぐ」「○週間後」「もう少し仲良くなってから」の具体的な判断
- そのタイミングを推奨する根拠（この会話の内容に基づいて）
- 告白前に準備・実行すべき具体的なアクション（2〜3点）
- このタイミングを逃すとどうなるかのリスク

===ADVICE===
今後の関係をどう発展させるかを200〜250文字で記載してください。

【含める内容】
- 次の1週間でやるべき具体的なアクション（LINEの内容・頻度・会う口実等）
- やってはいけないこと（この相手との関係で逆効果になる行動）
- 中長期（1〜2ヶ月）の関係発展シナリオ`;

  try {
    const anthropic = getAnthropic();
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
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
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return res;
  } catch {
    return NextResponse.json({ error: "AI分析中にエラーが発生しました" }, { status: 500 });
  }
}
