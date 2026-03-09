"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-rose-950 text-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="inline-block bg-pink-900 text-pink-300 text-xs font-bold px-3 py-1 rounded-full mb-6">
          💌 AI恋愛診断ツール
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
          彼のLINE、<br />
          <span className="text-pink-400">脈あり？AIが解読。</span>
        </h1>
        <p className="text-rose-200 text-lg max-w-2xl mx-auto mb-8">
          彼から来たLINEをコピペするだけ。AIが<strong className="text-white">脈あり度・彼の心理・返信例文</strong>まで本気で分析。
          既読スルー・短い返信・急な連絡…全部解読します。
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-10">
          {[["解読精度", "AI分析"], ["脈あり度", "0〜100%"], ["返信例文", "3パターン"]].map(([label, val]) => (
            <div key={label} className="bg-rose-900 rounded-xl p-3">
              <div className="text-pink-400 text-lg font-black">{val}</div>
              <div className="text-rose-400 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tool"
            className="bg-pink-500 hover:bg-pink-400 text-white font-black text-lg px-10 py-4 rounded-xl transition text-center"
          >
            💕 無料で解読する（3回）
          </Link>
          <button
            onClick={startCheckout}
            disabled={loading}
            className="border border-pink-600 text-pink-300 hover:text-white hover:border-pink-400 font-semibold text-lg px-10 py-4 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "処理中..." : "¥980/月で無制限に使う"}
          </button>
        </div>
        <p className="text-rose-500 text-sm mt-4">登録不要・クレジットカード不要で3回試せる</p>
      </section>

      {/* Pain Points */}
      <section className="bg-rose-900 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">こんな経験ありませんか？</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "😰", title: "既読スルーで眠れない", desc: "既読がついたのに返信がない。「もしかして嫌われた？」と不安で何度もLINEを見てしまう" },
              { icon: "💬", title: "「了解」だけ…脈ありなの？", desc: "返信が短すぎて気持ちが読めない。素っ気ないのか、忙しいだけなのか分からない" },
              { icon: "🌙", title: "深夜に急にLINEが来た", desc: "普段は返信が遅いのに、なぜか深夜だけ既読が早い。これって意味あるの？" },
            ].map((item) => (
              <div key={item.title} className="bg-rose-800 rounded-2xl p-6">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-pink-300">{item.title}</h3>
                <p className="text-rose-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-pink-400 font-bold text-xl mt-10">↓ AIが全部解読します ↓</p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-rose-950 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">使い方はかんたん3ステップ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "📋", title: "LINEをコピペ", desc: "彼とのLINEのやりとりをそのままコピーして貼り付けるだけ" },
              { step: "02", icon: "🤖", title: "AIが瞬時に分析", desc: "AIが文章のパターン・言葉の選び方・返信の温度感を総合的に分析" },
              { step: "03", icon: "💕", title: "結果を受け取る", desc: "脈あり度・彼の心理・あなたへの最適な返信例文が届く" },
            ].map((s) => (
              <div key={s.step} className="bg-rose-900 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-pink-500 text-xs font-black mb-1">STEP {s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-rose-300 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-rose-900 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">AIが分析してくれること</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "💯", title: "脈あり度スコア（0〜100%）", desc: "「74%」「28%」など数値で明示。友達止まりか、恋愛対象なのかを判定" },
              { icon: "🧠", title: "彼の心理・気持ちの分析", desc: "「忙しくて素っ気なくなっているだけ」「あなたに気がある可能性が高い」など心理を解読" },
              { icon: "✉️", title: "返信例文3パターン", desc: "「積極的に押す返信」「自然体でいく返信」「距離を置く返信」の3パターンをそのままコピーできる形で提案" },
              { icon: "💡", title: "恋愛アドバイス", desc: "今の関係をどう発展させるか、次にとるべきアクションを具体的にアドバイス" },
            ].map((f) => (
              <div key={f.title} className="bg-rose-800 rounded-2xl p-5 flex gap-4">
                <div className="text-3xl shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-rose-300 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-rose-950 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">使った人の声</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Aさん（高2女子）", text: "「了解」しか来なくて脈なしだと思ってたけど、AIに分析してもらったら「好意がある可能性が高い」って！その後告白したら付き合えました💕" },
              { name: "Bさん（大学1年）", text: "友達にLINEを見せると気を使って正直に言ってくれないから、AIの方が信頼できる。返信例文をそのまま使ったら既読スルー男から返事来た笑" },
              { name: "Cさん（高3女子）", text: "脈あり度28%って出て諦めようとしてたら「このままアプローチすると逆効果」って具体的なアドバイスがあって、作戦変えたら仲良くなれた" },
            ].map((t) => (
              <div key={t.name} className="bg-rose-900 rounded-2xl p-6">
                <p className="text-rose-200 text-sm mb-4">「{t.text}」</p>
                <p className="text-pink-400 text-xs font-bold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-rose-900 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-10">料金</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-rose-800 rounded-2xl p-8 border border-rose-700">
              <div className="text-rose-400 text-sm mb-2">無料プラン</div>
              <div className="text-4xl font-black text-white mb-2">¥0</div>
              <ul className="text-rose-300 text-sm mt-4 space-y-2 text-left">
                <li>✓ 3回まで解読可能</li>
                <li>✓ 全機能利用可</li>
                <li>✗ 3回以降は有料</li>
              </ul>
              <Link href="/tool" className="block mt-6 border border-rose-600 text-rose-300 font-bold py-3 rounded-xl hover:border-rose-400 transition">
                無料で試す
              </Link>
            </div>
            <div className="bg-pink-900 rounded-2xl p-8 border-2 border-pink-500">
              <div className="text-pink-300 text-sm font-bold mb-2">プレミアム</div>
              <div className="text-4xl font-black text-pink-400 mb-2">¥980</div>
              <div className="text-rose-300 text-sm mb-4">/月（税込）</div>
              <ul className="text-rose-200 text-sm space-y-2 text-left">
                <li>✓ 無制限に解読</li>
                <li>✓ 全分析機能</li>
                <li>✓ いつでも解約可能</li>
              </ul>
              <button
                onClick={startCheckout}
                disabled={loading}
                className="block w-full mt-6 bg-pink-500 hover:bg-pink-400 text-white font-black py-3 rounded-xl transition disabled:opacity-60"
              >
                {loading ? "処理中..." : "始める →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-rose-950 py-16 px-4 text-center">
        <h2 className="text-2xl font-black mb-4">まず無料で解読してみる</h2>
        <p className="text-rose-400 mb-8">登録不要・クレジットカード不要。3回まで全機能無料。</p>
        <Link
          href="/tool"
          className="inline-block bg-pink-500 hover:bg-pink-400 text-white font-black text-xl px-12 py-5 rounded-xl transition"
        >
          💕 無料で解読する →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-rose-800 py-8 px-4 text-center text-rose-600 text-xs">
        <p>© 2026 脈あり解読AI</p>
        <p className="mt-2">
          <Link href="/legal" className="hover:text-rose-400 underline">特定商取引法に基づく表記</Link>
          {" ｜ "}
          <Link href="/privacy" className="hover:text-rose-400 underline">プライバシーポリシー</Link>
        </p>
      </footer>
    </main>
  );
}
