"use client";
import { useState } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

export default function Home() {
  const [showPayjp, setShowPayjp] = useState(false);

  function startCheckout() {
    setShowPayjp(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="inline-block bg-blue-900 text-blue-300 text-xs font-bold px-3 py-1 rounded-full mb-6">
          💬 恋愛・婚活コーチAI — 脈あり判定 × 返信例文 × マッチングアプリ対応 — 無料3回
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
          あの人の気持ち、本当にわかる？
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-pink-400 mb-6">
          恋愛・マッチングアプリのやり取り、AIが全力サポート
        </p>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
          脈あり度スコア・返信パターン3通り・感情分析・恋愛アドバイス付きで、<strong className="text-white">その一言</strong>を後悔しない返信に。マッチングアプリ・婚活・交際中のやり取りすべてに対応。
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-pink-500 mb-4">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>登録不要・クレカ不要で<strong>今すぐ</strong>使えます</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/tool"
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
          >
            今すぐ恋愛AIに相談する（3回無料）→
          </Link>
          <button
            onClick={startCheckout}
            className="border border-blue-400 text-blue-300 hover:bg-blue-900 font-bold px-8 py-4 rounded-xl text-lg transition"
          >
            月額¥980で使い放題
          </button>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 mb-6 text-left max-w-md mx-auto">
          <p className="text-xs text-pink-500 font-semibold mb-2">💬 マッチングアプリでこんなメッセージが来たら？</p>
          <div className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-pink-100">
            <p className="text-sm text-gray-700">「週末って暇ですか？もしよかったら…」</p>
            <p className="text-xs text-gray-400 mt-1 text-right">マッチング相手から 22:47 ✓✓</p>
          </div>
          <p className="text-xs text-pink-400 text-center">↓ AIが脈あり判定＋最適な返信を提案</p>
          <div className="bg-pink-500 rounded-xl p-3 mt-2 text-right">
            <p className="text-sm text-white">「いいですね！どんなところ好きですか？😊」</p>
            <p className="text-xs text-pink-200 mt-1">脈あり度82%・AI提案文（3パターン）</p>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">こんな悩み、ありませんか？</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "😰", title: "返信が来ない…", body: "マッチングアプリで既読から2時間。これって脈なし？関係を続けるべき？不安で他のことが手につかない" },
              { emoji: "🤔", title: "何て返せばいい？", body: "「うん」「そうだね」みたいな短い返信。デートに誘いたいけど、婚活で距離感を間違えたくない" },
              { emoji: "💍", title: "次のステップに進めない", body: "いい感じな気はするけど、真剣な関係にどう進むか。婚活なら余計に失敗できないと感じる" },
            ].map((p) => (
              <div key={p.title} className="bg-slate-800 rounded-2xl p-6">
                <div className="text-3xl mb-3">{p.emoji}</div>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">使い方は超シンプル</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "LINEをコピペ", body: "好きな子とのやり取りをそのままテキストエリアに貼り付け" },
              { step: "2", title: "状況を入力", body: "「クラスメート」「付き合って2ヶ月」など関係性を一言で" },
              { step: "3", title: "AIが即分析", body: "脈あり度・返信例文・告白タイミングを30秒で生成" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/tool"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition inline-block"
            >
              今すぐ恋愛AIに相談する（3回無料）→
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">AIが教えてくれること</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { emoji: "❤️‍🔥", title: "脈あり度スコア", body: "0〜100%で数値化。会話のトーン・返信速度・絵文字の使い方など複合的に判断" },
              { emoji: "💌", title: "返信例文3パターン", body: "「距離を縮める返信」「自然なデート誘い」「余韻を残す一言」など状況別に生成" },
              { emoji: "📅", title: "告白タイミング分析", body: "「今すぐOK」「あと2週間」「もう少し仲良くなってから」とタイミングを具体的に提示" },
              { emoji: "💬", title: "告白文テンプレ", body: "LINE・直接・電話、シチュエーション別の告白文をそのまま使えるレベルで生成" },
              { emoji: "💔", title: "付き合い後の悩みも", body: "喧嘩した後どう仲直りする？ マンネリ打開策は？ 関係をより深めるためのアドバイスをAIが提案" },
              { emoji: "💍", title: "婚活・マッチングアプリ対応", body: "Pairs・タップル・with・Omiai等のやり取りも全対応。婚活の距離感・デートの誘い方・将来の話し方をAIが提案" },
            ].map((f) => (
              <div key={f.title} className="bg-slate-800 rounded-2xl p-6 flex gap-4">
                <div className="text-3xl shrink-0">{f.emoji}</div>
                <div>
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">使った人の声</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "28歳・会社員・女性", text: "マッチングアプリで脈あり度を判定してもらったら78%と出て、AIの提案を参考に返信したら会話が盛り上がってデートに発展しました" },
              { name: "32歳・男性・婚活中", text: "婚活でどう距離を縮めるか悩んでいたけど、返信の距離感をAIに分析してもらったら自信を持って動けるようになった" },
              { name: "25歳・女性", text: "友達に相談しにくい内容なのに、AIは全部フラットに答えてくれる。マッチングアプリのやり取りを毎回分析してもらってる" },
            ].map((t) => (
              <div key={t.name} className="bg-slate-800 rounded-2xl p-6">
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">「{t.text}」</p>
                <p className="text-blue-400 text-xs font-bold">{t.name}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">※個人の感想です。効果には個人差があります。</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-10">料金プラン</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <h3 className="font-bold text-lg mb-2">無料</h3>
              <div className="text-4xl font-black mb-4">¥0</div>
              <ul className="text-slate-400 text-sm space-y-2 mb-6 text-left">
                <li>✓ 3回まで無料で解析</li>
                <li>✓ 脈あり度・返信例文・告白タイミング</li>
                <li>✗ 告白文テンプレ（月額のみ）</li>
                <li>✗ 回数制限あり</li>
              </ul>
              <Link href="/tool" className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition text-center">
                <span className="text-pink-100 font-bold">無料で3回試せます</span>
              </Link>
            </div>
            <div className="bg-blue-900 rounded-2xl p-8 border-2 border-blue-400 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-400 text-slate-900 text-xs font-black px-4 py-1 rounded-full">おすすめ</div>
              <h3 className="font-bold text-lg mb-2">月額プラン</h3>
              <div className="text-4xl font-black mb-1">¥980<span className="text-lg font-normal text-blue-300">/月</span></div>
              <p className="text-xs text-gray-400 mb-4">1日たった約33円</p>
              <ul className="text-blue-200 text-sm space-y-2 mb-6 text-left">
                <li>✓ 解析し放題（回数制限なし）</li>
                <li>✓ <strong>返信パターン3通り提案</strong>（状況別・距離感別）</li>
                <li>✓ <strong>感情分析スコア付き</strong>（相手の感情を数値化）</li>
                <li>✓ <strong>恋愛アドバイス付き</strong>（次の一手を具体的に提案）</li>
                <li>✓ 告白文テンプレ（LINE/直接/電話）</li>
                <li>✓ 告白タイミング詳細分析</li>
              </ul>
              <button
                onClick={startCheckout}
                className="w-full bg-blue-400 hover:bg-blue-300 text-slate-900 font-black py-3 rounded-xl transition"
              >
                今すぐ始める（¥980/月）
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">あの人のことが気になるなら、今すぐ相談しよう</h2>
        <p className="text-slate-400 mb-8">クレカ不要・登録不要。LINEをコピペするだけ。3回無料。</p>
        <Link
          href="/tool"
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black px-10 py-5 rounded-2xl text-xl transition inline-block"
        >
          今すぐ恋愛AIに相談する（3回無料）→
        </Link>
      </section>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="space-x-4 mb-4">
          <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
          <Link href="/terms" className="hover:underline">利用規約</Link>
          <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
        </div>
        <div className="border-t border-slate-700 pt-3 text-xs">
          <p className="mb-1">ポッコリラボの他のサービス</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600">
            <a href="https://uranai-ai-sigma.vercel.app" className="hover:text-slate-400">占いAI</a>
            <a href="https://hada-ai.vercel.app" className="hover:text-slate-400">AI美肌診断</a>
            <a href="https://claim-ai-beryl.vercel.app" className="hover:text-slate-400">クレームAI</a>
            <a href="https://rougo-sim-ai.vercel.app" className="hover:text-slate-400">老後シミュレーターAI</a>
            <a href="https://hojyokin-ai-delta.vercel.app" className="hover:text-slate-400">補助金AI</a>
          </div>
        </div>
      </footer>
      {showPayjp && (
        <PayjpModal
          publicKey={PAYJP_PUBLIC_KEY}
          planLabel="プレミアムプラン ¥980/月 — LINE解析 無制限"
          onSuccess={() => setShowPayjp(false)}
          onClose={() => setShowPayjp(false)}
        />
      )}
    </main>
  );
}
