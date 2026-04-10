import type { Metadata } from "next";
import Link from "next/link";

interface KeywordData {
  title: string;
  h1: string;
  description: string;
  features: { icon: string; title: string; text: string }[];
  faqs: { q: string; a: string }[];
  lastUpdated: string;
}

const KEYWORDS: Record<string, KeywordData> = {
  "kokuhaku-ok-henshin-rei": {
    title: "告白 OK 返信 例文 LINE | 告白LINE返信AI",
    h1: "告白 OK 返信 例文 LINE",
    description: "告白されたときのOK返信例文をAIが提案。相手の気持ちを大切にした自然な返し方を作成します。",
    features: [
      { icon: "letter", title: "OK返信例文生成", text: "相手の告白文に合わせたナチュラルなOKの返信文をAIが即時生成" },
      { icon: "chat", title: "トーン調整", text: "かわいい・クール・真剣など、自分のキャラクターに合ったトーンで文章を調整" },
      { icon: "flower", title: "関係スタート提案", text: "OKした後の最初のデート提案まで含めた返信文をサポート" },
    ],
    faqs: [
      { q: "告白OKのLINE返信で気をつけることは？", a: "相手の気持ちに正直に応えること、自分の気持ちも伝えること、次のステップを示すことが大切です。AIが自然な文章を提案します。" },
      { q: "OKの返信はどれくらいの長さがいい？", a: "長すぎず短すぎず、2〜3行程度が理想的です。AIが適切な長さと内容で返信文を作成します。" },
      { q: "直接会って返事したほうがいい？", a: "状況によります。LINEで返事する場合の注意点と、会って返事する場合の違いもAIが説明します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "kokuhaku-kyozetsu-henshin-rei": {
    title: "告白 断り方 LINE 例文 | 告白LINE返信AI",
    h1: "告白 断り方 LINE 例文",
    description: "告白を丁寧に断るLINE例文をAIが作成。相手を傷つけず関係を保てる断り方の文章を提案します。",
    features: [
      { icon: "pray", title: "丁寧な断り文生成", text: "相手への感謝と配慮を忘れない、品のある断り文をAIが作成" },
      { icon: "hand", title: "関係継続型断り方", text: "友人関係を維持したい場合の断り方をシチュエーション別に提案" },
      { icon: "idea", title: "理由別カスタマイズ", text: "「好きな人がいる」「今は恋愛できない」など理由に合わせた文章を生成" },
    ],
    faqs: [
      { q: "告白の断り方で一番大切なことは？", a: "相手の勇気を尊重しながら、はっきりと自分の気持ちを伝えることです。曖昧な返事は相手を余計に傷つけます。" },
      { q: "LINEで断るのは失礼？", a: "状況によりますが、LINEでも誠意を持って伝えれば問題ありません。AIが相手への配慮が伝わる文章を作成します。" },
      { q: "断った後も普通に接したい場合は？", a: "断り方次第で関係継続は可能です。「友人として大切にしたい」という気持ちが伝わる文章をAIが提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "kokuhaku-line-taiming": {
    title: "告白 LINE タイミング 方法 | 告白LINE返信AI",
    h1: "告白 LINE タイミング 方法",
    description: "LINEで告白するベストタイミングと方法を解説。成功率を上げる告白LINEの送り時と文章のポイントをAIが提案します。",
    features: [
      { icon: "clock", title: "タイミング診断", text: "相手との関係性・連絡頻度から告白のベストタイミングをAIが判断" },
      { icon: "note", title: "告白文作成サポート", text: "伝わりやすく自分らしい告白文をAIが一緒に作成" },
      { icon: "target", title: "成功率向上アドバイス", text: "告白前にすべき準備と告白後の理想的な流れをAIが提案" },
    ],
    faqs: [
      { q: "LINEで告白するベストなタイミングは？", a: "楽しいデートや会話の後、相手がリラックスしている夜間、特別なイベントの前後などが成功率の高いタイミングです。" },
      { q: "告白LINEを送る前にすべきことは？", a: "相手の脈あり度確認、返信しやすい状況かの確認、告白文の事前準備が重要です。AIが準備チェックリストを提供します。" },
      { q: "LINEと直接どちらで告白すべき？", a: "相手の性格・関係性によります。AIが状況を分析して最適な告白方法を提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "kokuhaku-mae-line-naiyou": {
    title: "告白 前 LINE 内容 例 | 告白LINE返信AI",
    h1: "告白 前 LINE 内容 例",
    description: "告白する前のLINEの送り方と内容例を解説。告白成功につながる事前のアプローチ方法をAIがサポートします。",
    features: [
      { icon: "leaf", title: "事前アプローチ文生成", text: "告白前の雰囲気作りに最適なLINEの内容と流れをAIが提案" },
      { icon: "heart", title: "関係深化サポート", text: "告白に向けて関係を深めるための会話テーマ・送るべきメッセージを具体的に提示" },
      { icon: "chart", title: "脈あり確認診断", text: "告白前の相手の反応から脈あり度を確認。タイミングの見極めをサポート" },
    ],
    faqs: [
      { q: "告白前にどんなLINEを送ればいい？", a: "共通の話題・相手が楽しめる内容を中心に、自然な会話の流れを作ることが大切です。急に重い内容は避けましょう。" },
      { q: "告白前日はどんな連絡がいい？", a: "翌日会う約束がある場合は期待感を高めるメッセージが効果的。AIが状況に合ったメッセージを提案します。" },
      { q: "LINEだけで関係を深められる？", a: "LINEは関係を深めるツールとして有効ですが、直接会う機会も重要です。AIがオンライン・オフラインのバランスをアドバイスします。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "sukina-hito-line-kakikata": {
    title: "好きな人 LINE 送り方 例 | 告白LINE返信AI",
    h1: "好きな人 LINE 送り方 例",
    description: "好きな人へのLINEの送り方と例文を解説。自然に距離を縮める会話のきっかけと内容をAIが提案します。",
    features: [
      { icon: "gift", title: "最初のLINE例文", text: "自然なきっかけで送れる最初のLINE文例をシチュエーション別に提案" },
      { icon: "loop", title: "会話継続テク", text: "話が途切れない質問の入れ方や話題の広げ方をAIがアドバイス" },
      { icon: "phone", title: "送信頻度アドバイス", text: "相手の返信テンポに合わせた理想的な連絡頻度をAIが提案" },
    ],
    faqs: [
      { q: "好きな人への最初のLINEはどう送る？", a: "共通の話題や出来事を糸口に、返信しやすい質問を含めた内容がベストです。AIが状況に合った最初のメッセージを提案します。" },
      { q: "どれくらいの頻度で送ればいい？", a: "相手の返信ペースに合わせるのが基本です。毎日送るかは相手の反応次第で判断しましょう。" },
      { q: "好きな気持ちを匂わせるLINEは？", a: "さりげなく好意を伝える表現方法をAIが提案。重くならず自然に気持ちを伝えるテクニックを紹介します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "kokuhaku-kyozetsu-go-line": {
    title: "告白 断られた後 LINE 関係 | 告白LINE返信AI",
    h1: "告白 断られた後 LINE 関係",
    description: "告白を断られた後のLINEの送り方と関係の立て直し方を解説。友人関係の維持から逆転を狙う方法までAIがサポートします。",
    features: [
      { icon: "repair", title: "関係修復メッセージ", text: "断られた後も自然に関係を続けられるLINEの内容をAIが提案" },
      { icon: "strong", title: "逆転アドバイス", text: "断られた後から逆転するためのアプローチ戦略をAIが分析・提案" },
      { icon: "compass", title: "適切な距離感アドバイス", text: "相手が不快にならない連絡頻度と内容の見極め方をサポート" },
    ],
    faqs: [
      { q: "断られた後もLINEしていい？", a: "しばらく間を置いてから自然な内容で連絡するのが基本です。すぐに連絡すると重いと思われる可能性があります。" },
      { q: "告白後に友人関係を続けられる？", a: "お互いの気持ちと対応次第では可能です。AIが関係継続のための自然なLINEの内容を提案します。" },
      { q: "逆転するチャンスはある？", a: "状況によってはあります。AIが相手の反応・状況を分析して、逆転の可能性と最適なアプローチを提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "line-de-kokuhaku-bun": {
    title: "LINEで告白 文章 例文 | 告白LINE返信AI",
    h1: "LINEで告白 文章 例文",
    description: "LINEで告白する文章と例文を解説。気持ちが伝わる告白メッセージをAIが一緒に作成します。",
    features: [
      { icon: "write", title: "告白文作成AI", text: "自分の言葉で気持ちが伝わる告白文をAIが対話形式で一緒に作成" },
      { icon: "style", title: "スタイル別例文", text: "ストレート・ロマンチック・ユーモアなど複数スタイルの告白文を提案" },
      { icon: "check", title: "送信前チェック", text: "告白文を送る前のチェックポイントをAIがリストアップ。後悔しない告白をサポート" },
    ],
    faqs: [
      { q: "LINEの告白文はどう書けばいい？", a: "シンプルに自分の気持ちを伝えることが一番です。「あなたのことが好き」という核心を中心に、具体的なエピソードを添えると伝わりやすいです。" },
      { q: "長い告白文と短い告白文どちらがいい？", a: "長すぎると重くなりやすいです。3〜5行程度が読みやすく気持ちが伝わりやすいです。AIが適切な長さで作成します。" },
      { q: "絵文字や顔文字は使うべき？", a: "普段の会話スタイルに合わせるのがベストです。普段使わない場合は使わない方が自然です。AIが相手との関係性に合ったトーンで作成します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "kare-kare-kyori-line": {
    title: "彼氏 彼女 距離縮める LINE | 告白LINE返信AI",
    h1: "彼氏 彼女 距離縮める LINE",
    description: "気になる相手との距離を縮めるLINEの送り方を解説。自然に親密度を上げる会話テクニックをAIが提案します。",
    features: [
      { icon: "hug", title: "距離縮めLINEテク", text: "相手が心を開きやすいLINEの内容・タイミング・頻度をAIが提案" },
      { icon: "talk", title: "会話ネタ提供", text: "相手の興味・趣味に合わせた話題をAIが提案。会話が弾む内容を無限生成" },
      { icon: "calendar", title: "会う約束への誘導", text: "LINEからリアルの関係へ発展させるための自然な流れをAIがサポート" },
    ],
    faqs: [
      { q: "LINEで距離を縮めるコツは？", a: "相手が答えやすい質問を入れる、共通の話題を探す、相手のテンポに合わせるなどが効果的です。" },
      { q: "毎日LINEしていい？", a: "最初は相手の返信ペースに合わせてから徐々に頻度を上げるのが自然です。AIが段階的なアプローチを提案します。" },
      { q: "LINEだけで告白するのはアリ？", a: "相手の性格・関係性によります。LINEで告白するメリット・デメリットをAIが説明し、最適な方法を提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "shokuba-kokuhaku-line": {
    title: "職場 好きな人 LINE 送り方 | 告白LINE返信AI",
    h1: "職場 好きな人 LINE 送り方",
    description: "職場の好きな人へのLINEの送り方を解説。仕事関係を壊さない自然なアプローチ方法をAIがサポートします。",
    features: [
      { icon: "work", title: "職場恋愛特化アドバイス", text: "仕事上の関係に配慮しながら恋愛に発展させる方法をAIが提案" },
      { icon: "phone", title: "仕事→プライベートLINE移行", text: "業務連絡から個人的な会話へ自然に発展させるトーク例を提示" },
      { icon: "warn", title: "リスク管理", text: "職場恋愛のリスクを最小化しながらアプローチする方法をAIがアドバイス" },
    ],
    faqs: [
      { q: "職場の人へのLINEはどう送ればいい？", a: "最初は仕事に関連した自然なきっかけから始めるのが鉄則。プライベートな内容に移行するタイミングをAIが提案します。" },
      { q: "職場恋愛でLINEを送る際の注意点は？", a: "業務時間中の私的なLINEは控える、相手が引いたら即撤退、会社のルールを守ることが重要です。" },
      { q: "職場の人をデートに誘うには？", a: "まずLINEで親密度を上げてから、自然な流れでランチ・アフターに誘う段階的なアプローチをAIが提案します。" },
    ],
    lastUpdated: "2026-03-31",
  },
  "match-app-kokuhaku-line": {
    title: "マッチングアプリ 告白 LINE 例文 | 告白LINE返信AI",
    h1: "マッチングアプリ 告白 LINE 例文",
    description: "マッチングアプリで出会った相手への告白LINE例文を解説。オンラインから本物の恋愛へ発展させる文章をAIが提案します。",
    features: [
      { icon: "app", title: "マッチングアプリ特化テク", text: "マッチング後の最初のメッセージから告白までの流れをAIがサポート" },
      { icon: "target", title: "早期関係構築", text: "短期間で信頼関係を築くための会話内容と頻度をAIが最適化" },
      { icon: "star", title: "リアル移行サポート", text: "アプリ内→LINE→実際のデートへの自然な移行方法をAIが提案" },
    ],
    faqs: [
      { q: "マッチングアプリから告白するタイミングは？", a: "実際に会って数回デートした後が一般的です。アプリ内・LINE内で告白する場合の注意点もAIが解説します。" },
      { q: "マッチングアプリでの告白文の書き方は？", a: "オンラインで出会ったからこそ、誠実さと真剣さを文章で伝えることが重要です。AIが状況に合った告白文を作成します。" },
      { q: "LINE交換のタイミングは？", a: "数回メッセージを交換して相手の人柄を確認してから、会う約束の前後が自然なタイミングです。AIが判断をサポートします。" },
    ],
    lastUpdated: "2026-03-31",
  },
};

const ALL_SLUGS = Object.keys(KEYWORDS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = KEYWORDS[slug];
  if (!data) return { title: "Not Found" };

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      modifiedTime: data.lastUpdated,
      url: `https://kokuhaku-line-ai.vercel.app/keywords/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    },
    alternates: {
      canonical: `https://kokuhaku-line-ai.vercel.app/keywords/${slug}`,
    },
    other: {
      "article:modified_time": data.lastUpdated,
    },
  };
}

export default async function KeywordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = KEYWORDS[slug];

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>ページが見つかりません</h1>
          <Link href="/" style={{ color: "#f43f5e" }}>トップページへ戻る</Link>
        </div>
      </div>
    );
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "dateModified": data.lastUpdated,
    "mainEntity": data.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #4c0519 50%, #0f172a 100%)", color: "#e2e8f0", padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#f43f5e", fontWeight: "bold" }}>AI</div>
            <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: "bold", marginBottom: "1rem", background: "linear-gradient(90deg, #f43f5e, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {data.h1}
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#94a3b8", marginBottom: "2rem" }}>{data.description}</p>
            <Link
              href="/"
              style={{ display: "inline-block", background: "linear-gradient(135deg, #f43f5e, #fb923c)", color: "#fff", padding: "1rem 2.5rem", borderRadius: "50px", fontWeight: "bold", fontSize: "1.1rem", textDecoration: "none" }}
            >
              今すぐ無料でLINE文を作成 →
            </Link>
          </div>

          {/* Features */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center", color: "#f43f5e" }}>AIがサポートする3つのポイント</h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {data.features.map((f, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: "12px", padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "2rem" }}>{f.icon}</span>
                  <div>
                    <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "#f43f5e" }}>{f.title}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center", color: "#f43f5e" }}>よくある質問</h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {data.faqs.map((faq, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
                  <h3 style={{ fontWeight: "bold", marginBottom: "0.75rem", color: "#f43f5e", fontSize: "1rem" }}>Q: {faq.q}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginBottom: "3rem", padding: "2rem", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "16px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#f43f5e" }}>気持ちを伝えるLINEをAIが作成</h2>
            <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>状況を入力するだけで、あなたらしいLINE文をAIが提案</p>
            <Link
              href="/"
              style={{ display: "inline-block", background: "linear-gradient(135deg, #f43f5e, #fb923c)", color: "#fff", padding: "1rem 2.5rem", borderRadius: "50px", fontWeight: "bold", textDecoration: "none" }}
            >
              無料で作成してみる →
            </Link>
          </div>

          {/* Last Updated */}
          <p style={{ textAlign: "center", color: "#475569", fontSize: "0.8rem", marginBottom: "2rem" }}>
            最終更新: {data.lastUpdated}
          </p>

          {/* Cross Sell */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem" }}>
            <h3 style={{ textAlign: "center", color: "#94a3b8", marginBottom: "1rem" }}>他のAIツールも試してみる</h3>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="https://myakuari-ai.vercel.app" style={{ color: "#f43f5e", textDecoration: "none", fontSize: "0.9rem" }}>脈あり解読AI</Link>
              <Link href="https://konkatsu-ai.vercel.app" style={{ color: "#f43f5e", textDecoration: "none", fontSize: "0.9rem" }}>婚活AI</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
