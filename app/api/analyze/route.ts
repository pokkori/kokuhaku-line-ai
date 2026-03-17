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

  const prompt = `あなたは恋愛心理学を専門とするカウンセラーであり、10,000件以上のLINEコミュニケーションを分析してきました。社会心理学・愛着理論・言語分析・非言語コミュニケーション研究の知見をもとに、LINEのやり取りから相手の気持ちを科学的に読み解き、次の一手を具体的にアドバイスします。

## 出力の絶対ルール

1. **感情への共感を最初の2文で実現する**
   - ユーザーが今どんな気持ちでいるかを読み取り、「今どきどきしていますよね」「気になってしかたない状況ですね」と明示的に共感する
   - ユーザーが「わかってもらえた」と感じてから本題（分析）に入る

2. **驚き・発見の演出**
   - 「実は〜」「意外なことに〜」「多くの人が気づかない点ですが〜」という視点を1つ必ず含める
   - アタッチメント理論・心理的安全性・ミラーリングなど心理学的根拠を示す

3. **SNS映え設計（シェアテキスト）**
   - 出力の最後に「📱 友達に話すなら：」として、結果を自然にシェアできる一文を必ず含める
   - 例：「告白LINE返信AIで相談したら、まさかの○○って言われた…！当たりすぎてドキドキ #告白 #恋愛相談」

【品質基準（必須）】
- 各セクションは指定された文字数を必ず満たすこと（短縮禁止）
- 心理分析は「なぜそう読み取れるか」の根拠を必ず示すこと（例：「質問で会話を終わらせるのは、相手が会話を続けたいサインです」）
- 返信案・告白文は「そのまま使える」自然な日本語で記載すること。機械的・定型文的な表現は禁止
- 親しみやすく温かみのあるトーンを維持しながら、専門的な洞察を提供すること（例：「アタッチメント理論的に見ると…」「心理的安全性が高まっているサインとして…」）
- ユーザーの感情に寄り添い、勇気づけるアドバイスを意識すること

回答は自然な日本語で、経験豊富な友人に相談しているような親しみやすいトーンで書いてください。

【LINEの内容】
${line}

${context ? `【関係性・状況】\n${context}` : ""}

以下の形式で必ず回答してください：

===SCORE===
[脈あり度を0〜100の数値のみで記載。例：73]

===ANALYSIS===
相手の心理・気持ちの分析を**300〜400文字**で記載してください。300文字未満は不可。

【分析の観点（全て言及すること）】
- 言葉の選び方・表現のトーン（距離感・親密度・感情の開示度合い）。例：「タメ口混じりの表現は心理的距離が縮まっているサイン」
- 返信速度・文章量の傾向（積極性・関心度のサイン）。例：「短い返信でも質問で締めくくるのは会話継続の意思表示」
- 絵文字・スタンプの使い方（感情の開放度・意識しているサイン）
- 質問の有無・話題の広げ方（関係継続への意欲・あなたへの興味度）
- この会話で最も「脈あり」を示す具体的な根拠（1〜2点・心理学的解釈を付記）
- この会話で「脈なし」または「まだ判断しにくい」部分（正直に・過度な楽観は避ける）

===REPLIES===
今すぐ送れる返信案を3パターン、それぞれ実際に使えるLINE文として記載してください。

1. 【積極アプローチ】距離を縮める一言（送る前に一息ついて使う用。1〜2文。例：「○○っていつも気になってるんだけど、今度一緒に行ってみない？」）
2. 【自然な関係深め】会話を自然に続けながら好印象を残す返信（1〜2文。例：「それ、わかる！実は私も〜なんだよね。○○はどう思う？」）
3. 【余韻残し・次につなぐ】次に会う約束や共通話題につなげる返信（1〜2文。例：「そういえば○○って行ったことある？今度行こうよ！」）

各パターンに「なぜこの返信が心理的に効果的か」を1〜2行で必ず付記してください。

===CONFESSION===
告白文テンプレートを3パターン記載してください。それぞれ自然な日本語で、相手の心に響くよう具体的かつ誠実に書いてください。

LINE: （LINEで送る告白文。2〜4文。ストレートすぎず、でも気持ちがしっかり伝わる文体。例：「ずっと言えなかったんだけど、○○といる時間がすごく好きで。もし良かったら、もっとそばにいさせてほしい。」）
直接: （面と向かって伝える台本。2〜4文。緊張しながらも誠実に伝えるトーン。間の取り方・目線も意識した文体）
電話: （電話での告白台本。2〜4文。声で伝えることを意識した口語体。沈黙への対処も含む）

===TIMING===
告白のベストタイミングを**230〜300文字**で記載してください。230文字未満は不可。

【含める内容（全て言及すること）】
- 「今すぐ（○日以内）」「○週間後」「もう少し仲良くなってから（目安：○回デートor○週間）」の具体的な判断と根拠
- そのタイミングを推奨する心理学的・行動的根拠（この会話の内容に基づいて具体的に）
- 告白前に準備・実行すべき具体的なアクション（2〜3点。例：「LINEの頻度を週3→毎日に上げる」「次のデートで○○な話題を振る」）
- このタイミングを逃すと想定されるリスク（具体的に）

===ADVICE===
今後の関係をどう発展させるかを**230〜300文字**で記載してください。230文字未満は不可。

【含める内容（全て言及すること）】
- 次の1週間でやるべき具体的なアクション3点（LINEの内容・頻度・会う口実・話題等を具体的に。例：「月曜日に○○の話題でLINEを送り、週末のお誘いへつなぐ」）
- 絶対にやってはいけないこと2点（この相手との関係で逆効果になる行動と、その理由）
- 中長期（1〜2ヶ月）の関係発展シナリオ（フェーズ感を持たせた具体的な流れ）

===SHARE===
以下の形式でSNSシェア用テキストを1つ出力してください（友達に話す感覚で・体験談スタイル）：
「告白LINE返信AIで相談してみたら、脈あり度${context ? "が分かって" : "スコアと"}返信の心理的根拠まで教えてもらえた…！当たりすぎてびっくり 🫶 #告白 #恋愛相談 #LINE」`;

  try {
    const anthropic = getAnthropic();
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const newUsedCount = usedCount + 1;
    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Remaining": isPremium ? "unlimited" : String(FREE_LIMIT - newUsedCount),
    };
    if (!isPremium) {
      headers["Set-Cookie"] = `free_uses=${newUsedCount}; Max-Age=${60 * 60 * 24}; Path=/; SameSite=Lax; HttpOnly; Secure`;
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
        } catch (err) {
          console.error(err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, { headers });
  } catch {
    return NextResponse.json({ error: "AI分析中にエラーが発生しました" }, { status: 500 });
  }
}
