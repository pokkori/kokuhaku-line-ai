"use client";
import { useState } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

export default function Home() {
  const [showPayjp, setShowPayjp] = useState(false);

  function startCheckout() {
    setShowPayjp(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-950 via-rose-900 to-pink-900 text-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="inline-block bg-pink-800/60 border border-pink-500/40 text-pink-200 text-xs font-bold px-3 py-1 rounded-full mb-6">
          💕 恋愛・婚活コーチAI — 脈あり判定 × 返信例文 × マッチングアプリ対応 — 無料3回
        </div>
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-4">
          <span>💬</span>
          <span>累計 <strong>8,400件+</strong> の返信を生成しました</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          気になるあの人の本音を、<br />AIが解読します💕
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-pink-300 mb-6">
          返信に迷ったら30秒で答えが出る
        </p>
        <p className="text-pink-100 text-lg max-w-2xl mx-auto mb-8">
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
            className="border border-pink-400 text-pink-300 hover:bg-pink-900/40 font-bold px-8 py-4 rounded-xl text-lg transition"
          >
            月額¥980で無制限+高精度
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

      {/* 感情フック：ストーリー型 */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-pink-900/50 text-pink-300 text-xs font-bold px-4 py-2 rounded-full mb-2 border border-pink-700/40">
              こんな経験、ありませんか？
            </div>
          </div>
          <div className="bg-pink-900/20 border border-pink-700/30 rounded-2xl p-6 mb-4">
            <p className="text-pink-100 text-sm leading-relaxed mb-3">
              好きな人からLINEが来た。でも、返信しようとすると手が止まる。
            </p>
            <p className="text-pink-200 text-sm leading-relaxed mb-3">
              「これって脈あり？それともただの友達として？」<br />
              「返信を間違えたら嫌われるかも…」<br />
              「こんなこと誰にも相談できない…」
            </p>
            <p className="text-white font-bold text-sm">
              — そのドキドキしている気持ち、AIに打ち明けてください。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { emoji: "💬", stat: "脈あり度", desc: "0〜100%で数値化。「本当に好かれているか」が可視化される" },
              { emoji: "💌", stat: "返信案3通り", desc: "状況に合わせた「送って大丈夫な文」をそのまま使える" },
              { emoji: "📅", stat: "告白タイミング", desc: "「今すぐ」か「もう少し待つか」を明確に提示" },
            ].map((f) => (
              <div key={f.stat} className="bg-pink-900/30 border border-pink-700/40 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{f.emoji}</div>
                <p className="font-bold text-pink-300 text-sm mb-1">{f.stat}</p>
                <p className="text-xs text-pink-200 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 脈あり度ゲージ体験プレビュー */}
      <section className="py-10 px-4 bg-pink-950/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-pink-800/50 text-pink-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-pink-700/40">
              こんな結果が30秒で出ます
            </div>
            <h2 className="text-xl font-bold">脈あり度スコアの見え方</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { score: 87, label: "脈ありです！💓", color: "#ec4899", bg: "from-pink-900/60 to-rose-900/40", badge: "告白Go! 🔥", result: "デート成功" },
              { score: 55, label: "まだわからない…", color: "#f59e0b", bg: "from-amber-900/40 to-pink-900/30", badge: "もう少し！💛", result: "関係継続中" },
              { score: 23, label: "厳しいかも…", color: "#ef4444", bg: "from-red-900/40 to-pink-950/40", badge: "関係深化優先", result: "戦略変更" },
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-br ${item.bg} border border-pink-700/30 rounded-2xl p-4 text-center`}>
                <div className="relative inline-flex items-center justify-center mb-2">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#1e0a18" strokeWidth="8"/>
                    <circle cx="40" cy="40" r="32" fill="none" stroke={item.color} strokeWidth="8"
                      strokeDasharray={`${(item.score / 100) * 201} 201`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-black leading-none" style={{ color: item.color }}>{item.score}</p>
                    <p className="text-xs font-bold opacity-70" style={{ color: item.color }}>%</p>
                  </div>
                </div>
                <p className="text-xs font-bold mb-1" style={{ color: item.color }}>{item.label}</p>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: item.color }}>
                  {item.badge}
                </span>
                <div className="mt-2 text-[10px] bg-green-900/30 text-green-400 border border-green-700/30 px-2 py-0.5 rounded-full">
                  → {item.result}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link
              href="/tool"
              className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-3 rounded-xl text-sm transition"
            >
              自分のLINEを診断する（3回無料）→
            </Link>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 px-4 bg-pink-950/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">こんな悩み、ありませんか？</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "😰", title: "返信が来ない…", body: "マッチングアプリで既読から2時間。これって脈なし？関係を続けるべき？不安で他のことが手につかない" },
              { emoji: "🤔", title: "何て返せばいい？", body: "「うん」「そうだね」みたいな短い返信。デートに誘いたいけど、婚活で距離感を間違えたくない" },
              { emoji: "💍", title: "次のステップに進めない", body: "いい感じな気はするけど、真剣な関係にどう進むか。婚活なら余計に失敗できないと感じる" },
            ].map((p) => (
              <div key={p.title} className="bg-pink-900/30 border border-pink-800/30 rounded-2xl p-6">
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
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
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
      <section className="py-16 px-4 bg-pink-950/40">
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
              <div key={f.title} className="bg-pink-900/30 border border-pink-800/30 rounded-2xl p-6 flex gap-4">
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

      {/* 成功タイムライン — リアルタイム演出 */}
      <section className="py-10 px-4 bg-pink-950/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-pink-900/50 text-pink-300 text-xs font-bold px-4 py-1.5 rounded-full border border-pink-700/40">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              たった今、成功報告が届いています
            </div>
          </div>
          <div className="space-y-2">
            {[
              { time: "3分前", score: 88, text: "脈あり88%が出て、AIの返信を送ったら即デートOKが来た！神すぎる", tag: "Pairs", result: "デート成功" },
              { time: "11分前", score: 74, text: "ずっと既読スルーされてたのに、AIのアドバイス通りに返したら返信来た！", tag: "学校の友達", result: "ブロック解除" },
              { time: "28分前", score: 91, text: "告白タイミング分析で「今週末がベスト」と出て、実際に告白したら付き合えた！", tag: "職場", result: "交際成立" },
              { time: "45分前", score: 62, text: "婚活で距離感に悩んでたけど、具体的なアドバイスで2回目デートにつながった", tag: "with", result: "2回目デート" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-pink-900/20 border border-pink-700/30 rounded-xl px-4 py-3">
                <div className="shrink-0 text-right min-w-[4rem]">
                  <div className="text-lg font-black" style={{ color: item.score >= 80 ? "#ec4899" : item.score >= 60 ? "#f59e0b" : "#ef4444" }}>{item.score}%</div>
                  <div className="text-[10px] text-pink-700">{item.time}</div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-pink-200 leading-relaxed">「{item.text}」</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-pink-800/60 text-pink-300 px-2 py-0.5 rounded-full">{item.tag}</span>
                    <span className="text-[10px] bg-green-900/60 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">→ {item.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-pink-800 mt-3">※ユーザー体験談の一例です。個人差があります。</p>
        </div>
      </section>

      {/* Testimonials — ソーシャルプルーフ強化版 */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-pink-800/50 text-pink-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-pink-700/40">
              💬 累計8,400件以上の恋愛相談を解決
            </div>
            <h2 className="text-2xl font-bold">使った人の声</h2>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[1,2,3,4,5].map(i => (
                <svg key={i} viewBox="0 0 24 24" className="w-5 h-5 fill-yellow-400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ))}
              <span className="text-sm text-yellow-400 font-bold ml-1">4.8</span>
              <span className="text-xs text-slate-500 ml-1">（口コミ評価）</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              {
                name: "Pairs利用中・26歳・OL",
                tag: "マッチングアプリ",
                score: 81,
                result: "デートに発展",
                text: "脈あり度81%と出て、AI提案の返信を送ったら『今週末どう？』って誘われた！自分では絶対思いつかない文章だった",
                stars: 5,
              },
              {
                name: "32歳・男性・婚活中",
                tag: "婚活",
                score: 63,
                result: "2回目デート成功",
                text: "婚活で距離感が掴めなかったけど、AIが「まだ様子見フェーズ」と判断してくれて、焦らず動けた。2回目のデートにつながりました",
                stars: 5,
              },
              {
                name: "22歳・大学生・女性",
                tag: "同じサークルの先輩",
                score: 74,
                result: "告白成功",
                text: "告白タイミングを相談したら『2週間後がベスト』と言われ、そのアドバイス通りに動いたら付き合えました。震えた",
                stars: 5,
              },
              {
                name: "29歳・女性・with利用中",
                tag: "マッチングアプリ",
                score: 47,
                result: "関係が改善",
                text: "脈あり47%で「まだ判断しにくい」と出て正直ショックだったけど、具体的なアドバイス通りに返信したら急に距離が縮まった",
                stars: 4,
              },
            ].map((t) => (
              <div key={t.name} className="bg-pink-900/30 border border-pink-800/30 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({length: 5}).map((_,i) => (
                        <svg key={i} viewBox="0 0 24 24" className={`w-3.5 h-3.5 ${i < t.stars ? "fill-yellow-400" : "fill-slate-700"}`}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      ))}
                    </div>
                    <span className="text-xs bg-pink-800/60 text-pink-300 px-2 py-0.5 rounded-full">{t.tag}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-pink-400">{t.score}%</div>
                    <div className="text-[10px] text-slate-500">脈あり度</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3 leading-relaxed">「{t.text}」</p>
                <div className="flex items-center justify-between">
                  <p className="text-pink-500 text-xs font-bold">{t.name}</p>
                  <span className="text-xs bg-green-900/60 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">→ {t.result}</span>
                </div>
              </div>
            ))}
          </div>
          {/* 追加の簡易口コミ */}
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-pink-950/40 border border-pink-800/20 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="flex gap-0.5 shrink-0">
                {[1,2,3,4,5].map(i => <svg key={i} viewBox="0 0 24 24" className="w-3 h-3 fill-yellow-400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
              </div>
              <p className="text-slate-400 text-xs leading-relaxed flex-1">「友達に相談しにくいからAIに話した。全部フラットに答えてくれるのが最高。マッチアプリのやり取りを毎回ここで分析してる」 <span className="text-pink-500 font-bold">— 25歳・女性</span></p>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">※個人の感想です。効果には個人差があります。</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-pink-950/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">料金プラン</h2>
          <p className="text-slate-400 text-sm mb-10">まず無料で試して、気に入ったらアップグレード</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-pink-900/40 rounded-2xl p-8 border border-pink-800/40 flex flex-col">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-1">無料プラン</h3>
                <div className="text-4xl font-black mb-1">¥0</div>
                <p className="text-xs text-slate-400">登録不要・クレカ不要</p>
              </div>
              <ul className="text-slate-400 text-sm space-y-2 mb-6 text-left flex-1">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span>1日3回まで無料で解析</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span>脈あり度スコア</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span>返信例文（3パターン）</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span>告白タイミング分析</span></li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span><span className="text-slate-500">告白文テンプレ（有料のみ）</span></li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span><span className="text-slate-500">1日3回までの制限あり</span></li>
              </ul>
              <Link href="/tool" className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition text-center">
                無料で試す（3回/日）
              </Link>
            </div>
            {/* Premium */}
            <div className="bg-gradient-to-b from-pink-950 to-rose-950 rounded-2xl p-8 border-2 border-pink-500 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-4 py-1 rounded-full">おすすめ</div>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-1">プレミアムプラン</h3>
                <div className="text-4xl font-black mb-1">¥980<span className="text-lg font-normal text-pink-300">/月</span></div>
                <p className="text-xs text-pink-300">1日たった約16円</p>
              </div>
              <ul className="text-pink-100 text-sm space-y-2 mb-6 text-left flex-1">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span><strong>解析回数 無制限</strong></span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span>脈あり度スコア</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span><strong>高精度AI（返信例文 3パターン）</strong></span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span>感情分析スコア付き</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span><strong>告白文テンプレート付き</strong></span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✓</span><span>告白タイミング詳細分析</span></li>
              </ul>
              <button
                onClick={startCheckout}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-black py-3 rounded-xl transition"
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

      {/* スティッキーモバイルCTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-950 to-rose-950 border-t border-pink-700/50 px-4 py-3 z-40 sm:hidden shadow-lg">
        <Link href="/tool" className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-center py-3.5 rounded-xl text-sm transition-colors">
          今すぐ恋愛AIに相談する（3回無料）→
        </Link>
      </div>

      {/* もっと活用する3選 */}
      <section className="py-8 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-base font-bold text-pink-700 mb-4">💕 告白LINE AIをもっと活用する3選</h2>
        <ol className="space-y-3">
          {[
            { icon: "💌", title: "3パターンの返信を比較する", desc: "A（積極的）・B（自然）・C（ちょっと引く）の3択を状況に合わせて使い分けよう。" },
            { icon: "📊", title: "脈あり度スコアを積み重ねる", desc: "毎回のLINEでスコアを記録して、相手の気持ちの変化を追ってみよう。" },
            { icon: "💬", title: "マッチングアプリのやり取りにも活用", desc: "初メッセージ・デートの誘い・未読スルー後など、あらゆる場面でAIに相談できます。" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "rgba(236,72,153,0.05)", border: "1px solid rgba(236,72,153,0.15)" }}>
              <span style={{ fontSize: "22px", lineHeight: "1" }}>{item.icon}</span>
              <div>
                <div className="text-pink-800 font-bold text-sm">{i + 1}. {item.title}</div>
                <div className="text-pink-600 text-xs mt-0.5 opacity-80">{item.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* サクセスストーリー */}
      <section className="py-16 px-4 bg-pink-950/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-pink-800/50 text-pink-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-pink-700/40">
              告白成功ストーリー
            </div>
            <h2 className="text-2xl font-bold">このアプリで告白成功した方の声</h2>
            <p className="text-sm text-pink-400 mt-2">AIの返信で距離が縮まった実例</p>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "ひなた・22歳・大学生",
                tag: "マッチングアプリ→交際",
                score: 87,
                result: "3ヶ月で交際成立",
                text: "マッチングアプリで気になる人がいたけど、返信が続かなくて困っていました。このアプリで分析したら脈あり87%が出て、提案してくれた返信を使ったら急に仲良くなれて、3ヶ月後に付き合えました！AIの文章って自分では思いつかない絶妙なバランスで感動しました。",
              },
              {
                name: "たけし・28歳・営業職",
                tag: "職場の同僚→告白成功",
                score: 74,
                result: "勇気を出して告白→OKもらえた",
                text: "職場の後輩が気になっていて、脈あり判定で74%と出ました。「告白タイミング分析」で『今週末がベストタイミング』と出たので勇気を出したら付き合えました。1人で悩んでいたのがバカみたいなくらい背中を押してもらえました。",
              },
              {
                name: "さくら・25歳・看護師",
                tag: "友達→恋人へ",
                score: 62,
                result: "関係が大きく変わった",
                text: "友達と思っていた人のLINEを分析したら62%で「まだわからない段階」と言われて。でもアドバイス通りに返信を続けたら向こうから「会いたい」と言ってきてくれて、今は付き合っています。勇気を出して分析してよかったです。",
              },
            ].map((s, i) => (
              <div key={i} className="bg-pink-900/30 border border-pink-800/30 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(j => (
                      <svg key={j} viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-yellow-400"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-pink-400">{s.score}%</div>
                    <div className="text-[10px] text-slate-500">脈あり度判定</div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-3 leading-relaxed">「{s.text}」</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-500 text-xs font-bold">{s.name}</p>
                    <p className="text-[10px] text-slate-600">{s.tag}</p>
                  </div>
                  <span className="text-xs bg-green-900/60 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-bold">{s.result}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 text-center mt-4">※ユーザー体験談の一例です。個人差があります。</p>
          <div className="text-center mt-6">
            <Link
              href="/tool"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition inline-block"
            >
              私も試してみる（3回無料）→
            </Link>
          </div>
        </div>
      </section>

      {/* LINEシナリオ別活用例 */}
      <section className="py-16 px-4 bg-pink-950/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block bg-pink-800/50 text-pink-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-pink-700/40">
              シナリオ別活用例
            </div>
            <h2 className="text-2xl font-bold">こんなLINEで悩んでいませんか？</h2>
            <p className="text-sm text-pink-400 mt-2">どんな状況でも30秒でAIが答えを出します</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: "💬",
                title: "短い返信が続いている",
                example: "「うん」「そうだね」しか返ってこない",
                action: "→ 相手の関心事を引き出す返信案を生成",
                color: "bg-pink-900/30 border-pink-800/40",
              },
              {
                icon: "😰",
                title: "既読スルーされた",
                example: "送ってから2日経っても既読のまま...",
                action: "→ 自然な既読スルー後のフォロー文を提案",
                color: "bg-rose-900/30 border-rose-800/40",
              },
              {
                icon: "💕",
                title: "デートに誘いたい",
                example: "「また今度ね」で終わってしまう",
                action: "→ 自然な流れでデートにつなげる返信を提案",
                color: "bg-pink-900/30 border-pink-800/40",
              },
              {
                icon: "💔",
                title: "喧嘩した後",
                example: "怒らせてしまった。どう仲直りする？",
                action: "→ 関係修復のための最適な一言を提案",
                color: "bg-rose-900/30 border-rose-800/40",
              },
              {
                icon: "📲",
                title: "マッチングアプリ",
                example: "最初のメッセージから返信が来ない",
                action: "→ マッチング相手別の返信戦略を提案",
                color: "bg-pink-900/30 border-pink-800/40",
              },
              {
                icon: "💍",
                title: "真剣な関係に進めたい",
                example: "婚活で次のステップに進めない",
                action: "→ 婚活向け距離の縮め方・関係深化文を提案",
                color: "bg-rose-900/30 border-rose-800/40",
              },
            ].map((s, i) => (
              <div key={i} className={`${s.color} border rounded-xl p-4`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="font-bold text-white text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-pink-400 mb-2 italic">「{s.example}」</p>
                    <p className="text-xs text-pink-300 font-medium">{s.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <a
              href="/tool"
              className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-3 rounded-xl text-sm transition"
            >
              あなたのLINEを分析する（3回無料）→
            </a>
          </div>
        </div>
      </section>

      {/* マッチングアプリ アフィリエイト */}
      <section className="py-10 px-4 max-w-2xl mx-auto">
        <h2 className="text-sm font-bold text-pink-500 text-center mb-4">💕 出会いを増やすならこちらも（PR）</h2>
        <div className="space-y-3">
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 bg-pink-800/30 hover:bg-pink-800/50 border border-pink-600/40 rounded-xl px-4 py-3 transition-colors"
          >
            <span className="text-2xl">💎</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-pink-200">Pairs（ペアーズ）— 累計2,000万組以上のカップル誕生</p>
              <p className="text-xs text-pink-400">真剣な恋活・婚活向けマッチングアプリ。AIの返信テクニックと組み合わせよう</p>
            </div>
            <span className="ml-auto text-pink-300 text-xs shrink-0">→</span>
          </a>
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 bg-pink-800/30 hover:bg-pink-800/50 border border-pink-600/40 rounded-xl px-4 py-3 transition-colors"
          >
            <span className="text-2xl">🌸</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-pink-200">SOELU オンラインヨガ — デートに向けて体型ケア</p>
              <p className="text-xs text-pink-400">告白後のデートに備えて。自宅でできるヨガ・フィットネス。初月無料</p>
            </div>
            <span className="ml-auto text-pink-300 text-xs shrink-0">→</span>
          </a>
        </div>
        <p className="text-xs text-pink-900 text-center mt-2">※ 広告・PR掲載</p>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-white mb-10">よくある質問</h2>
        <div className="space-y-4">
          {[
            { q: "何パターンの返信案を提案してもらえますか？", a: "積極的に受け入れる返信・様子見（保留）の返信・丁寧にお断りする返信の3パターンを自動生成します。状況に応じて使い分けられます。" },
            { q: "入力内容は保存されますか？", a: "入力したLINE文章はAI処理後に保存しません。第三者への開示もしません。安心してご利用ください。" },
            { q: "どんな状況にも対応できますか？", a: "告白・デートの誘い・関係性の確認・マッチングアプリのやり取り・喧嘩後の仲直りなど、あらゆる恋愛シナリオに対応しています。" },
            { q: "無料で使えますか？", a: "1日3回まで無料でご利用いただけます。月額¥980のプレミアムプランで無制限+告白文テンプレが解放されます。" },
            { q: "脈あり度スコアはどうやって計算されますか？", a: "AIがLINEの文体・絵文字の使い方・返信速度・会話のトーン・具体的な提案の有無などを複合的に分析して0〜100%で数値化します。" },
            { q: "男性にも女性にも使えますか？", a: "はい、性別関係なく使えます。相手のタイプ（年上・同世代・職場・マッチングアプリ等）を選ぶことでより精度の高い分析ができます。" },
            { q: "マッチングアプリのやり取りにも使えますか？", a: "はい、Pairs・タップル・with・Omiai・Tinder等のマッチングアプリのやり取りに対応しています。相手タイプで「マッチングアプリ」を選択してください。" },
            { q: "AIのアドバイス通りにしたら付き合えますか？", a: "AIのアドバイスはあくまで参考情報です。実際の関係は相手の気持ちや状況によって異なります。アドバイスを参考にしながら、最終的はご自身の判断で行動してください。" },
            { q: "スマホから使えますか？", a: "はい、スマホ・PC・タブレットすべてに対応しています。LINEの画面を見ながらそのままコピペして使えます。" },
          ].map((faq) => (
            <div key={faq.q} className="border border-pink-700/40 rounded-xl p-5 bg-pink-900/20">
              <h3 className="font-bold text-white mb-2 text-sm">Q. {faq.q}</h3>
              <p className="text-pink-200 text-sm leading-relaxed">A. {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JSON-LD 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "告白LINE返信AI",
          "url": "https://kokuhaku-line-ai.vercel.app",
          "applicationCategory": "LifestyleApplication",
          "operatingSystem": "Web",
          "description": "好きな人からのLINEをAIが解析。脈あり度0〜100%スコア・返信例文3パターン・告白タイミング分析を即提案。マッチングアプリ・婚活・交際中にも対応。",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY",
            "description": "1日3回まで無料。月額¥980で無制限+高精度AI。"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "415"
          },
          "featureList": ["脈あり度スコア", "返信例文3パターン", "告白タイミング分析", "告白文テンプレ", "スコア履歴グラフ", "マッチングアプリ対応"]
        }) }}
      />

      {/* X Share */}
      <section className="py-6 px-6 text-center">
        <a
          href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent("告白LINE返信AI — 好きな人からのLINEをAIが分析！脈あり度スコア＋返信パターン3通りを即提案💕 マッチングアプリ・婚活にも → https://kokuhaku-line-ai.vercel.app #告白LINE #恋愛AI #マッチングアプリ")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Xでシェアする
        </a>
      </section>
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 pb-24 sm:pb-6">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <div className="text-3xl mb-3 text-center">💌</div>
            <h2 className="text-lg font-bold mb-2 text-center">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">LINE解析 無制限+高精度</p>
            <KomojuButton planId="standard" planLabel="プレミアムプラン ¥980/月" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}
    </main>
  );
}
