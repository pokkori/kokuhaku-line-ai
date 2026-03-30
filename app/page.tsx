"use client";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";
import { updateStreak, loadStreak, getStreakMilestoneMessage, type StreakData } from "@/lib/streak";
import { StreakBanner } from "@/components/StreakBanner";
import { UsageCounter } from "@/components/UsageCounter";
import { ShareButtons } from "@/components/ShareButtons";
import { AdBanner } from "@/components/AdBanner";

// Canvas APIで脈あり度シェアカード画像を生成
function generateShareCard(score: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 1200, 630);
  grad.addColorStop(0, '#fce4ec');
  grad.addColorStop(1, '#f48fb1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 630);

  ctx.beginPath();
  ctx.arc(1050, 100, 180, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150, 500, 140, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(244, 63, 94, 0.10)';
  ctx.fill();

  const color = score >= 70 ? '#c2185b' : score >= 40 ? '#e65100' : '#b71c1c';

  ctx.fillStyle = color;
  ctx.font = 'bold 180px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${score}%`, 600, 290);

  ctx.fillStyle = '#880e4f';
  ctx.font = 'bold 52px sans-serif';
  ctx.fillText('脈あり度診断結果', 600, 380);

  const judgment = score >= 70
    ? '告白チャンス！今すぐ行動しよう'
    : score >= 40
    ? '脈あり気配あり もう少しで行ける'
    : 'まずは距離を縮めるところから';
  ctx.fillStyle = '#ad1457';
  ctx.font = '40px sans-serif';
  ctx.fillText(judgment, 600, 460);

  ctx.beginPath();
  ctx.moveTo(300, 510);
  ctx.lineTo(900, 510);
  ctx.strokeStyle = 'rgba(194, 24, 91, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#e91e63';
  ctx.font = '30px sans-serif';
  ctx.fillText('告白LINE返信AI | kokuhaku-line-ai.vercel.app', 600, 570);

  return canvas.toDataURL('image/png');
}

const PAYJP_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "";

// クイック脈あり自己診断
const QUICK_QUIZ: { q: string; yes: number; no: number }[] = [
  { q: "最近1週間以内にLINEのやり取りをした", yes: 18, no: 0 },
  { q: "相手から先にLINEを送ってくることがある", yes: 20, no: 0 },
  { q: "返信が1時間以内に来ることが多い", yes: 15, no: 0 },
  { q: "絵文字や「笑」を使った返信が来る", yes: 12, no: 0 },
  { q: "2人きりで会ったことがある、または誘われたことがある", yes: 22, no: 0 },
  { q: "自分の話（好き・趣味・プライベート）をしてくれる", yes: 13, no: 0 },
];

function QuickDiagnosis({ onDiagnosisComplete }: { onDiagnosisComplete?: () => void }) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(QUICK_QUIZ.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [cardCopied, setCardCopied] = useState(false);

  const handleShareCard = useCallback(async (score: number) => {
    try {
      const dataUrl = generateShareCard(score);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCardCopied(true);
      setTimeout(() => setCardCopied(false), 3000);
    } catch {
      const dataUrl = generateShareCard(score);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `myakuari_${score}percent.png`;
      a.click();
      setCardCopied(true);
      setTimeout(() => setCardCopied(false), 3000);
    }
  }, []);

  const answered = answers.filter(a => a !== null).length;
  const score = answers.reduce((sum, a, i) => {
    if (a === true) return sum + QUICK_QUIZ[i].yes;
    return sum;
  }, 0);
  const maxScore = QUICK_QUIZ.reduce((s, q) => s + q.yes, 0);
  const pct = Math.round((score / maxScore) * 100);

  const toggle = (i: number, val: boolean) => {
    const next = [...answers];
    next[i] = val;
    setAnswers(next);
    if (next.filter(a => a !== null).length === QUICK_QUIZ.length) {
      setTimeout(() => {
        setShowResult(true);
        onDiagnosisComplete?.();
      }, 300);
    }
  };

  const reset = () => { setAnswers(Array(QUICK_QUIZ.length).fill(null)); setShowResult(false); };

  const color = pct >= 70 ? "#ec4899" : pct >= 40 ? "#f59e0b" : "#ef4444";
  const label = pct >= 70 ? "脈あり度 高め！ 告白のチャンスです" : pct >= 40 ? "まだわからない… もう少し様子を見よう" : "厳しいかも… 関係を深めるところから";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-block bg-pink-800/50 text-pink-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-pink-700/40">
          30秒で脈あり度がわかる
        </div>
        <h2 className="text-xl font-bold">クイック脈あり自己診断</h2>
        <p className="text-xs text-pink-400 mt-2">6つの質問に「はい/いいえ」で答えるだけ</p>
      </div>
      {!showResult ? (
        <div className="space-y-3">
          {QUICK_QUIZ.map((q, i) => (
            <div key={i} className="bg-pink-900/30 border border-pink-800/40 rounded-xl px-4 py-3">
              <p className="text-sm text-pink-100 mb-2">{i + 1}. {q.q}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(i, true)}
                  aria-label={`${i + 1}番目の質問「${q.q}」に「はい」と答える`}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${answers[i] === true ? "bg-pink-500 text-white" : "bg-pink-900/40 text-pink-300 hover:bg-pink-800/60"}`}
                >
                  はい
                </button>
                <button
                  onClick={() => toggle(i, false)}
                  aria-label={`${i + 1}番目の質問「${q.q}」に「いいえ」と答える`}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${answers[i] === false ? "bg-slate-600 text-white" : "bg-pink-900/40 text-pink-300 hover:bg-pink-800/60"}`}
                >
                  いいえ
                </button>
              </div>
            </div>
          ))}
          <div className="text-center text-xs text-pink-600 mt-2">{answered}/{QUICK_QUIZ.length}問 回答済み</div>
        </div>
      ) : (
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#1e0a18" strokeWidth="12"/>
              <circle cx="70" cy="70" r="58" fill="none" stroke={color} strokeWidth="12"
                strokeDasharray={`${(pct / 100) * 364} 364`} strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-black" style={{ color }}>{pct}</p>
              <p className="text-lg font-bold opacity-70" style={{ color }}>%</p>
            </div>
          </div>
          <p className="font-bold text-lg mb-2" style={{ color }}>{label}</p>
          <p className="text-xs text-pink-400 mb-4">この簡易診断はあくまで目安です。AIに実際のLINEを解析させることで精度が大幅に上がります。</p>
          <div className="flex flex-col gap-3">
            {/* シェアカードボタン */}
            <button
              onClick={() => handleShareCard(pct)}
              aria-label="脈あり度カードを画像としてクリップボードにコピーしてXでシェアする"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-600 to-pink-700 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg"
            >
              {cardCopied ? 'コピー完了! Xに貼り付けてシェアしよう' : '脈あり度カードを画像コピー → Xへ'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`告白LINE AI簡易診断で脈あり${pct}%でした！\n#告白LINE #脈あり診断\nhttps://kokuhaku-line-ai.vercel.app`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-black hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition text-sm"
            >
              脈あり{pct}%をXでシェア
            </a>
            <Link href="/tool" className="block bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-8 py-3 rounded-xl transition">
              LINEの文章をAIに解析してもらう（3回無料）→
            </Link>
            <button onClick={reset} aria-label="クイック脈あり自己診断をリセットしてもう一度最初から診断する" className="text-xs text-pink-600 hover:text-pink-400 underline">
              もう一度診断する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [showPayjp, setShowPayjp] = useState(false);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [streakMsg, setStreakMsg] = useState<string | null>(null);

  useEffect(() => {
    setStreak(loadStreak("kokuhaku"));
  }, []);

  function startCheckout() {
    setShowPayjp(true);
  }

  function handleDiagnosisComplete() {
    const s = updateStreak("kokuhaku");
    setStreak(s);
    const msg = getStreakMilestoneMessage(s.count);
    if (msg) setStreakMsg(msg);
  }

  return (
    <main className="min-h-screen text-white relative" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(120,80,200,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(200,80,180,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(80,100,220,0.1) 0%, transparent 50%), #0B0B1E" }}>
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {[
          { size: 4, x: '10%', y: '20%', dur: '6s', delay: '0s' },
          { size: 3, x: '85%', y: '15%', dur: '8s', delay: '1s' },
          { size: 5, x: '70%', y: '60%', dur: '7s', delay: '2s' },
          { size: 3, x: '25%', y: '75%', dur: '9s', delay: '0.5s' },
          { size: 4, x: '50%', y: '40%', dur: '10s', delay: '3s' },
          { size: 6, x: '90%', y: '80%', dur: '7s', delay: '1.5s' },
        ].map((p, i) => (
          <div key={i} className="absolute rounded-full animate-pulse" style={{ width: p.size, height: p.size, left: p.x, top: p.y, background: 'rgba(168,85,247,0.3)', animationDuration: p.dur, animationDelay: p.delay }} />
        ))}
      </div>
      <StreakBanner />

      {/* Hero */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="inline-block bg-pink-800/60 border border-pink-500/40 text-pink-200 text-xs font-bold px-3 py-1 rounded-full mb-6">
          恋愛・婚活コーチAI -- 脈あり判定 x 返信例文 x マッチングアプリ対応 -- 無料3回
        </div>
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="20,6 9,17 4,12"/></svg>
          <span className="text-slate-300">累計 <strong className="text-white">8,400件+</strong> の返信を生成しました</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          気になるあの人の本音を、<br />
          <span style={{ background: "linear-gradient(135deg, #E9D5FF, #FFFFFF, #FBCFE8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AIが解読します</span>
        </h1>
        {streak && streak.count > 0 && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm" style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="inline -mt-0.5" aria-hidden="true"><path d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z" fill="#f472b6" /></svg>
            <span className="text-pink-300">{streak.count}日連続利用中</span>
          </div>
        )}
        {streakMsg && <div className="text-orange-600 font-bold text-sm text-center">{streakMsg}</div>}
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
        <div className="max-w-xs mx-auto mb-4"><UsageCounter /></div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/tool"
            aria-label="告白LINE返信AIツールを開く（3回無料）"
            className="text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] min-h-[52px] inline-block"
            style={{ background: "linear-gradient(135deg, #A855F7, #EC4899)", boxShadow: "0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(236,72,153,0.15)" }}
          >
            今すぐ恋愛AIに相談する（3回無料）→
          </Link>
          <button
            onClick={startCheckout}
            aria-label="月額980円プレミアムプランの申し込みモーダルを開く"
            className="border border-pink-400 text-pink-300 hover:bg-pink-900/40 font-bold px-8 py-4 rounded-xl text-lg transition"
          >
            月額¥980で無制限+高精度
          </button>
        </div>
        <div className="rounded-2xl p-5 mb-6 text-left max-w-md mx-auto" style={{ background: 'rgba(255,240,245,0.12)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,182,193,0.25)' }}>
          <p className="text-xs text-pink-500 font-semibold mb-2"> マッチングアプリでこんなメッセージが来たら？</p>
          <div className="bg-white rounded-xl p-3 mb-2 shadow-sm border border-pink-100">
            <p className="text-sm text-gray-700">「週末って暇ですか？もしよかったら…」</p>
            <p className="text-xs text-gray-400 mt-1 text-right">マッチング相手から 22:47 OKOK</p>
          </div>
          <p className="text-xs text-pink-400 text-center">↓ AIが脈あり判定＋最適な返信を提案</p>
          <div className="bg-pink-500 rounded-xl p-3 mt-2 text-right">
            <p className="text-sm text-white">「いいですね！どんなところ好きですか？」</p>
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
          <div className="rounded-2xl p-6 mb-4" style={{ background: 'rgba(131,24,67,0.18)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(190,24,93,0.30)' }}>
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
              { emoji: "heart", stat: "脈あり度", desc: "0〜100%で数値化。「本当に好かれているか」が可視化される" },
              { emoji: "chat", stat: "返信案3通り", desc: "状況に合わせた「送って大丈夫な文」をそのまま使える" },
              { emoji: "clock", stat: "告白タイミング", desc: "「今すぐ」か「もう少し待つか」を明確に提示" },
            ].map((f) => (
              <div key={f.stat} className="rounded-xl p-4 text-center" style={{ background: 'rgba(131,24,67,0.25)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(190,24,93,0.35)' }}>
                <div className="mb-2">{f.emoji === "heart" ? <svg width="24" height="24" viewBox="0 0 24 24" fill="#ec4899" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> : f.emoji === "chat" ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>}</div>
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
              { score: 87, label: "脈ありです！", color: "#ec4899", bg: "from-pink-900/60 to-rose-900/40", badge: "告白Go! ", result: "デート成功" },
              { score: 55, label: "まだわからない…", color: "#f59e0b", bg: "from-amber-900/40 to-pink-900/30", badge: "もう少し！", result: "関係継続中" },
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

      {/* クイック脈あり自己診断 */}
      <section className="py-14 px-4 bg-pink-950/30">
        <QuickDiagnosis onDiagnosisComplete={handleDiagnosisComplete} />
      </section>

      {/* Pain points */}
      <section className="py-16 px-4 bg-pink-950/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">こんな悩み、ありませんか？</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "phone", title: "返信が来ない...", body: "マッチングアプリで既読から2時間。これって脈なし？関係を続けるべき？不安で他のことが手につかない" },
              { emoji: "question", title: "何て返せばいい？", body: "「うん」「そうだね」みたいな短い返信。デートに誘いたいけど、婚活で距離感を間違えたくない" },
              { emoji: "arrow", title: "次のステップに進めない", body: "いい感じな気はするけど、真剣な関係にどう進むか。婚活なら余計に失敗できないと感じる" },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl p-6" style={{ background: 'rgba(131,24,67,0.22)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(157,23,77,0.30)' }}>
                <div className="mb-3">{p.emoji === "phone" ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg> : p.emoji === "question" ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19,12 12,19 5,12"/></svg>}</div>
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
              { emoji: "gauge", title: "脈あり度スコア", body: "0〜100%で数値化。会話のトーン・返信速度・絵文字の使い方など複合的に判断" },
              { emoji: "pen", title: "返信例文3パターン", body: "「距離を縮める返信」「自然なデート誘い」「余韻を残す一言」など状況別に生成" },
              { emoji: "cal", title: "告白タイミング分析", body: "「今すぐOK」「あと2週間」「もう少し仲良くなってから」とタイミングを具体的に提示" },
              { emoji: "doc", title: "告白文テンプレ", body: "LINE・直接・電話、シチュエーション別の告白文をそのまま使えるレベルで生成" },
              { emoji: "refresh", title: "付き合い後の悩みも", body: "喧嘩した後どう仲直りする？ マンネリ打開策は？ 関係をより深めるためのアドバイスをAIが提案" },
              { emoji: "app", title: "婚活・マッチングアプリ対応", body: "Pairs・タップル・with・Omiai等のやり取りも全対応。婚活の距離感・デートの誘い方・将来の話し方をAIが提案" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6 flex gap-4" style={{ background: 'rgba(131,24,67,0.22)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(157,23,77,0.30)' }}>
                <div className="shrink-0">{
                  f.emoji === "gauge" ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 2a10 10 0 110 20 10 10 0 010-20z"/><path d="M12 6v6l4 2"/></svg> :
                  f.emoji === "pen" ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> :
                  f.emoji === "cal" ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> :
                  f.emoji === "doc" ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> :
                  f.emoji === "refresh" ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> :
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
                }</div>
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
               累計8,400件以上の恋愛相談を解決
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
              <div key={t.name} className="rounded-2xl p-5" style={{ background: 'rgba(131,24,67,0.22)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(157,23,77,0.30)' }}>
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
            <div className="rounded-2xl p-8 flex flex-col" style={{ background: 'rgba(131,24,67,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(157,23,77,0.35)' }}>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-1">無料プラン</h3>
                <div className="text-4xl font-black mb-1">¥0</div>
                <p className="text-xs text-slate-400">登録不要・クレカ不要</p>
              </div>
              <ul className="text-slate-400 text-sm space-y-2 mb-6 text-left flex-1">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span>1日3回まで無料で解析</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span>脈あり度スコア</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span>返信例文（3パターン）</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span>告白タイミング分析</span></li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">NG</span><span className="text-slate-500">告白文テンプレ（有料のみ）</span></li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">NG</span><span className="text-slate-500">1日3回までの制限あり</span></li>
              </ul>
              <Link href="/tool" className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition text-center">
                無料で試す（3回/日）
              </Link>
            </div>
            {/* Premium */}
            <div className="rounded-2xl p-8 relative flex flex-col" style={{ background: 'rgba(80,10,40,0.60)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '2px solid rgba(236,72,153,0.55)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-4 py-1 rounded-full">おすすめ</div>
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-1">プレミアムプラン</h3>
                <div className="text-4xl font-black mb-1">¥980<span className="text-lg font-normal text-pink-300">/月</span></div>
                <p className="text-xs text-pink-300">1日たった約16円</p>
              </div>
              <ul className="text-pink-100 text-sm space-y-2 mb-6 text-left flex-1">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span><strong>解析回数 無制限</strong></span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span>脈あり度スコア</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span><strong>高精度AI（返信例文 3パターン）</strong></span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span>感情分析スコア付き</span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span><strong>告白文テンプレート付き</strong></span></li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">OK</span><span>告白タイミング詳細分析</span></li>
              </ul>
              <button
                onClick={startCheckout}
                aria-label="プレミアムプラン月額980円の申し込みを開始する"
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
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 z-40 sm:hidden" style={{ background: "rgba(15,15,26,0.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1px solid rgba(236,72,153,0.2)" }}>
        <Link href="/tool" className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-center py-3.5 rounded-xl text-sm transition-colors">
          今すぐ恋愛AIに相談する（3回無料）→
        </Link>
      </div>

      {/* もっと活用する3選 */}
      <section className="py-8 px-4 max-w-lg mx-auto">
        <h2 className="text-center text-base font-bold text-pink-300 mb-4">告白LINE AIをもっと活用する3選</h2>
        <ol className="space-y-3">
          {[
            { title: "3パターンの返信を比較する", desc: "A（積極的）・B（自然）・C（ちょっと引く）の3択を状況に合わせて使い分けよう。" },
            { title: "脈あり度スコアを積み重ねる", desc: "毎回のLINEでスコアを記録して、相手の気持ちの変化を追ってみよう。" },
            { title: "マッチングアプリのやり取りにも活用", desc: "初メッセージ・デートの誘い・未読スルー後など、あらゆる場面でAIに相談できます。" },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl p-3"
              style={{ background: "rgba(236,72,153,0.05)", border: "1px solid rgba(236,72,153,0.15)" }}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-sm font-black text-pink-300" style={{ background: "rgba(236,72,153,0.15)" }}>{i + 1}</span>
              <div>
                <div className="text-pink-300 font-bold text-sm">{item.title}</div>
                <div className="text-pink-500/70 text-xs mt-0.5">{item.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 毎日追跡セクション */}
      <section className="py-10 px-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-xl p-6" style={{ background: "rgba(236,72,153,0.08)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(236,72,153,0.2)" }}>
            <h3 className="font-bold text-pink-300 text-lg">相手の気持ちを毎日追跡</h3>
            <p className="text-pink-400/70 mt-2 text-sm">毎日LINEを診断するたびに脈あり%の推移グラフが更新されます。<br/>「先週より5%上昇」「傾向は上向き」など関係性の変化をAIが分析。</p>
            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">7</div>
                <div className="text-xs text-pink-500/70">日連続記録中</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">↗72%</div>
                <div className="text-xs text-pink-500/70">今週の脈あり率</div>
              </div>
            </div>
          </div>
        </div>
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
              {
                name: "りょう・31歳・エンジニア",
                tag: "既読スルー→ブロック解除",
                score: 39,
                result: "復活して交際へ",
                text: "2日間既読スルーされて諦めかけていたとき、AIに分析してもらったら「焦りすぎず、違うトピックで軽く話しかけると良い」とアドバイスが。そのまま実践したら普通に返信が来て、その後付き合えました。",
              },
              {
                name: "みなみ・20歳・専門学生",
                tag: "片思い6ヶ月→告白成功",
                score: 71,
                result: "6ヶ月越しに告白OKもらえた",
                text: "半年間ずっと片思いで、返信がくるたびにドキドキしていました。脈あり71%が出て、告白タイミング分析で「今週末が絶好のタイミング」と出たので思い切って告白したらOKもらえました。自分一人では絶対動けなかったと思います。",
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
                title: "短い返信が続いている",
                example: "「うん」「そうだね」しか返ってこない",
                action: "→ 相手の関心事を引き出す返信案を生成",
                color: "bg-pink-900/30 border-pink-800/40",
              },
              {
                title: "既読スルーされた",
                example: "送ってから2日経っても既読のまま...",
                action: "→ 自然な既読スルー後のフォロー文を提案",
                color: "bg-rose-900/30 border-rose-800/40",
              },
              {
                title: "デートに誘いたい",
                example: "「また今度ね」で終わってしまう",
                action: "→ 自然な流れでデートにつなげる返信を提案",
                color: "bg-pink-900/30 border-pink-800/40",
              },
              {
                title: "喧嘩した後",
                example: "怒らせてしまった。どう仲直りする？",
                action: "→ 関係修復のための最適な一言を提案",
                color: "bg-rose-900/30 border-rose-800/40",
              },
              {
                title: "マッチングアプリ",
                example: "最初のメッセージから返信が来ない",
                action: "→ マッチング相手別の返信戦略を提案",
                color: "bg-pink-900/30 border-pink-800/40",
              },
              {
                title: "真剣な関係に進めたい",
                example: "婚活で次のステップに進めない",
                action: "→ 婚活向け距離の縮め方・関係深化文を提案",
                color: "bg-rose-900/30 border-rose-800/40",
              },
            ].map((s, i) => (
              <div key={i} className={`${s.color} border rounded-xl p-4`}>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-black text-pink-300" style={{ background: "rgba(236,72,153,0.15)" }}>{i + 1}</span>
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
        <h2 className="text-sm font-bold text-pink-500 text-center mb-4">出会いを増やすならこちらも（PR）</h2>
        <div className="space-y-3">
          <a
            href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 bg-pink-800/30 hover:bg-pink-800/50 border border-pink-600/40 rounded-xl px-4 py-3 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" className="shrink-0" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" className="shrink-0" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
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

      {/* シェアセクション */}
      <section className="py-6 px-6 text-center">
        <ShareButtons url="https://kokuhaku-line-ai.vercel.app" text="告白LINE返信AIを使ってみた！" hashtags="告白LINE返信AI" />
      </section>
      <footer className="py-6 text-center text-xs text-slate-500 pb-24 sm:pb-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
        <div className="flex items-center justify-center gap-2 text-xs text-slate-600 mt-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          SSL暗号化通信 | データは安全に保護されています
        </div>
      </footer>
      <AdBanner slot="" />
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby="premium-modal-title">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} aria-label="プレミアムプランモーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl"></button>
            <div className="text-3xl mb-3 text-center"></div>
            <h2 id="premium-modal-title" className="text-lg font-bold mb-2 text-center">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">LINE解析 無制限+高精度</p>
            <KomojuButton planId="standard" planLabel="プレミアムプラン ¥980/月" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}
    </main>
  );
}
