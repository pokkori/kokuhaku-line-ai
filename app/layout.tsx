import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAdScript } from "@/components/GoogleAdScript";
import "./globals.css";
import { InstallPrompt } from "@/components/InstallPrompt";


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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "告白LINE返信AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og.png"],
  },
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",
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
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
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
        <Analytics />
        <GoogleAdScript />
      </body>
    </html>
  );
}
