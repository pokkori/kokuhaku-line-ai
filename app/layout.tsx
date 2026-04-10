import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import FeedbackButton from "@/components/FeedbackButton";
import { GoogleAdScript } from "@/components/GoogleAdScript";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});


const SITE_URL = "https://kokuhaku-line-ai.vercel.app";
const TITLE = "告白LINE返信AI | 好きな子のLINEをAIが分析。脈あり度・返信例文・告白タイミングを判定";
const DESC = "好きな子のLINEをコピペするだけ。AIが脈あり度を0〜100%で判定し、最適な返信例文・告白文・告白タイミングまで生成。3回無料。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'></text></svg>" },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "告白LINE返信AI",
    locale: "ja_JP",
    type: "website",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "告白LINE返信AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/og.png`],
  },
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "告白LINEの返信はAIが自動で作ってくれますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。相手からのLINEメッセージを入力するだけで、あなたの気持ちや状況に合わせた返信文をAIが自動生成します。" } },
    { "@type": "Question", "name": "どんな状況に対応していますか？", "acceptedAnswer": { "@type": "Answer", "text": "片思い・告白・デート誘い・脈あり確認・自然な距離縮め・関係修復など、恋愛LINEの様々な場面に対応しています。" } },
    { "@type": "Question", "name": "生成された返信文をそのまま使っても大丈夫ですか？", "acceptedAnswer": { "@type": "Answer", "text": "AIが生成した文章はたたき台としてお使いください。あなたのキャラクターや言葉遣いに合わせて調整することをおすすめします。" } },
    { "@type": "Question", "name": "入力した内容は保存されますか？", "acceptedAnswer": { "@type": "Answer", "text": "入力内容はAI生成のみに使用し、サーバーに保存されません。プライバシーは保護されています。" } },
    { "@type": "Question", "name": "使用回数に制限はありますか？", "acceptedAnswer": { "@type": "Answer", "text": "無料プランでは1日に利用できる生成回数に上限があります。無制限に使いたい方はプレミアムプランをご利用ください。" } },
    { "@type": "Question", "name": "スマートフォンから使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、スマートフォン・タブレット・PCのすべてのデバイスに対応したWebアプリです。" } },
    { "@type": "Question", "name": "男性でも女性でも使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、男性・女性どちらでもご利用いただけます。相手の性別や関係性を入力することでより適切な返信文が生成されます。" } },
    { "@type": "Question", "name": "返信文のトーン（カジュアル/真剣）は選べますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、フレンドリー・真剣・甘め・冷静など複数のトーンから選択できます。シーンに合わせてお選びください。" } },
    { "@type": "Question", "name": "何文字くらいの返信文が生成されますか？", "acceptedAnswer": { "@type": "Answer", "text": "状況に応じて短め（〜50文字）・普通（50〜150文字）・長め（150文字〜）を選択できます。LINEらしい自然な長さで生成します。" } },
    { "@type": "Question", "name": "告白以外のLINE相談にも使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、デート後のお礼LINE・既読スルーへの対応・関係をより深める一言など、告白以外の場面でも幅広くお使いいただけます。" } }
  ]
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "ホーム", "item": SITE_URL },
    { "@type": "ListItem", "position": 2, "name": "告白LINE返信AIツール", "item": `${SITE_URL}/tool` },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "告白LINE返信AI",
      "url": SITE_URL,
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "description": "無料3回・プレミアム¥980/月" },
      "description": DESC,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "LINEのどんな内容を入力すればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "気になる相手とのLINEのやり取りをそのままコピーして貼り付けてください。相手の返信内容・絵文字・返信速度のパターンなどから脈あり度を判定します。マッチングアプリ・友達・職場の人など相手を問わず分析できます。"
          }
        },
        {
          "@type": "Question",
          "name": "無料で何回使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "登録不要・クレジットカード不要で1日3回まで無料で利用できます。プレミアムプラン（¥980/月）では回数無制限・告白文テンプレートなど全機能が利用可能になります。"
          }
        },
        {
          "@type": "Question",
          "name": "脈あり度の判定はどのくらい正確ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AIが言葉の選び方・返信速度・絵文字の使い方・質問の有無など複数の指標を総合的に分析します。ただし、AIの判定はあくまで参考情報です。相手の気持ちを確認するためには実際のコミュニケーションが重要です。"
          }
        },
        {
          "@type": "Question",
          "name": "マッチングアプリのやり取りにも使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、Pairs・タップル・with・Omiai・Tinder等のマッチングアプリのやり取りに完全対応しています。マッチング後の最初のメッセージ・デートの誘い方・既読スルー後のアプローチなど、婚活・恋活のあらゆる場面でご利用いただけます。"
          }
        },
        {
          "@type": "Question",
          "name": "返信パターンは何通り提案してもらえますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "「A: 積極的に受け入れる」「B: まだ考えたい（様子見）」「C: 丁寧に断る」の3パターンを同時に提案します。さらにA案のカジュアル版・絵文字あり版も提示するので、合計5パターンの返信候補から選べます。"
          }
        },
        {
          "@type": "Question",
          "name": "既読スルーが続く場合の対応策は？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "既読スルーが2〜3回続く場合は、返信しやすい短い話題転換メッセージが効果的です。本AIが相手の興味・最後のやり取りを踏まえた「ナチュラルな再アプローチ文」を生成します。追撃は控えめに、間を置くことが成功率を高めます。"
          }
        },
        {
          "@type": "Question",
          "name": "相手の年齢や性格によって文章を変えられますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "相手の年齢・性格（クール・天然・真面目など）・関係性（友達・職場・学校）を入力すると、その相手に最適なトーンの返信文を生成します。10代向けのカジュアルな文体から、30代向けの落ち着いた文体まで自動調整されます。"
          }
        },
        {
          "@type": "Question",
          "name": "LINEの長文と短文はどちらが効果的ですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "関係の段階によって異なります。知り合ったばかりの場合は短文でテンポよく会話を続けることが重要で、信頼関係が深まったら気持ちを丁寧に伝える長文が効果的です。本AIが関係進度に合わせた最適な文量の返信文を提案します。"
          }
        },
        {
          "@type": "Question",
          "name": "告白文の例文も生成してもらえますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい。脈あり度が高いと判定された場合、告白のタイミング・場所・メッセージ文のセットを生成します。直接会って伝えるパターン・LINEで告白するパターン・デートに誘いながら告白するパターンの3通りを提案します。"
          }
        },
        {
          "@type": "Question",
          "name": "デートに誘うためのLINEはどう送ればいいですか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "「〇〇に興味ある？今度一緒に行かない？」のようにカジュアルに誘うことで断られにくくなります。本AIが相手のLINEの雰囲気・趣味の話題を活かしたデートの誘い方の文を生成します。断られた場合のフォロー文も同時に提案します。"
          }
        },
        {
          "@type": "Question",
          "name": "職場・学校の人への告白には使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "職場恋愛・学校での片思いに特化した文体でも生成できます。告白後も関係を保ちやすい文章・相手に配慮した断り方の参考文も提案します。関係性がぎくしゃくしないよう配慮したアドバイスも添えます。"
          }
        },
        {
          "@type": "Question",
          "name": "LINEでフラれた後の立ち直り方をアドバイスしてくれますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "フラれた後のLINEの返信文（礼儀正しく次の関係性を保つ文）と、適切な距離感の保ち方のアドバイスを提供します。友達関係を続けたい場合・しばらく距離を置きたい場合のそれぞれの文例を生成します。"
          }
        },
        {
          "@type": "Question",
          "name": "脈なしサインはどんなものがありますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "返信が一言・既読スルーが続く・質問が一切返ってこない・スタンプだけで返信されるなどが脈なしサインです。本AIがLINEの内容からこれらのパターンを検出し、脈あり度0〜100%で判定します。"
          }
        },
        {
          "@type": "Question",
          "name": "入力したLINEの内容は保存・学習に使われますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "プライバシーを最優先に設計しており、入力されたLINEの内容はAIの返信生成にのみ使用されます。個人を特定できる情報の保存・第三者提供・学習への利用は行いません。詳細はプライバシーポリシーをご確認ください。"
          }
        },
        {
          "@type": "Question",
          "name": "彼氏・彼女との関係改善にも使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "告白前の段階だけでなく、カップル間の喧嘩後の仲直り文・冷却期間後の連絡文・遠距離恋愛でのLINEコミュニケーションにもご活用いただけます。関係の状態を入力すると最適なアプローチを提案します。"
          }
        },
        {
          "@type": "Question",
          "name": "解約はどうすれば？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "マイページの「プラン管理」からいつでも解約できます。解約後は次回更新日まで引き続きご利用いただけます。更新日の24時間前までに解約手続きを行えば、翌月分の請求は発生しません。"
          }
        },
        {
          "@type": "Question",
          "name": "スマホから使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、スマートフォン（iPhone・Android）のブラウザからそのままご利用いただけます。LINEのやり取りをコピーして貼り付けるだけで、移動中でも簡単に使えます。アプリのインストールは不要です。"
          }
        },
        {
          "@type": "Question",
          "name": "AIの判定はどの程度信頼できますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "本AIは恋愛心理学・コミュニケーション分析のデータをもとに脈あり度を判定しますが、あくまで参考情報です。人の気持ちは複雑で文章だけでは判断できない部分もあります。AIの結果を参考にしながら、最終的には自分の判断を大切にしてください。"
          }
        },
        {
          "@type": "Question",
          "name": "LINE以外のSNSのメッセージにも使えますか？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "はい、インスタグラムのDM・X（旧Twitter）のDM・Facebookメッセンジャー・マッチングアプリのチャットなど、テキスト形式のやり取りであれば分析・返信生成に対応しています。"
          }
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "name": "告白LINE返信AI",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web Browser",
      "url": SITE_URL,
      "description": DESC,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "JPY",
        "description": "無料3回・プレミアム¥980/月"
      }
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen text-white" style={{ background: '#0B0B1E' }}>
        {children}
        <InstallPrompt />
        <FeedbackButton />
        <Analytics />
        <SpeedInsights />
        <GoogleAdScript />
        {process.env.NEXT_PUBLIC_CLARITY_ID && process.env.NODE_ENV === 'production' && (
          <Script
            id="clarity-init"
            strategy="afterInteractive"
          >
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
