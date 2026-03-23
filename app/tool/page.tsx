"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";
import { track } from '@vercel/analytics';

// Canvas APIで脈あり度シェアカード画像を生成
function generateShareCard(score: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d')!;

  // 背景グラデーション（ピンク→ローズ）
  const grad = ctx.createLinearGradient(0, 0, 1200, 630);
  grad.addColorStop(0, '#fce4ec');
  grad.addColorStop(1, '#f48fb1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 630);

  // 装飾的な円（背景）
  ctx.beginPath();
  ctx.arc(1050, 100, 180, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150, 500, 140, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(244, 63, 94, 0.10)';
  ctx.fill();

  // スコアに応じた色
  const color = score >= 70 ? '#c2185b' : score >= 40 ? '#e65100' : '#b71c1c';

  // メインスコア
  ctx.fillStyle = color;
  ctx.font = 'bold 180px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${score}%`, 600, 290);

  // サブテキスト
  ctx.fillStyle = '#880e4f';
  ctx.font = 'bold 52px sans-serif';
  ctx.fillText('脈あり度診断結果', 600, 380);

  // 判定テキスト
  const judgment = score >= 70
    ? '💕 告白チャンス！今すぐ行動しよう'
    : score >= 40
    ? '🌸 脈あり気配あり もう少しで行ける'
    : '💭 まずは距離を縮めるところから';
  ctx.fillStyle = '#ad1457';
  ctx.font = '40px sans-serif';
  ctx.fillText(judgment, 600, 460);

  // 区切り線
  ctx.beginPath();
  ctx.moveTo(300, 510);
  ctx.lineTo(900, 510);
  ctx.strokeStyle = 'rgba(194, 24, 91, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // サービス名
  ctx.fillStyle = '#e91e63';
  ctx.font = '30px sans-serif';
  ctx.fillText('告白LINE返信AI | kokuhaku-line-ai.vercel.app', 600, 570);

  return canvas.toDataURL('image/png');
}

type Result = {
  score: number;
  analysis: string;
  replies: string[];
  confession: string;
  timing: string;
  adviceLine: string;
} | null;

const PARTNER_TYPES = [
  { id: "older", label: "📱 年上（5歳以上）" },
  { id: "same", label: "👫 同世代" },
  { id: "younger", label: "👶 年下（3歳以下）" },
  { id: "workplace", label: "🏢 職場の人" },
  { id: "school", label: "🎓 学校の知人" },
  { id: "app", label: "📲 マッチングアプリ" },
] as const;
type PartnerTypeId = (typeof PARTNER_TYPES)[number]["id"];

// シチュエーション別クイックテンプレート
const SITUATION_PRESETS = [
  {
    label: "💘 初めてのデートに誘う",
    icon: "💘",
    line: "「週末って暇ですか？もしよかったら一緒にどこか行きませんか？」",
    context: "マッチングアプリで知り合って2週間、毎日LINEしている",
    partnerTypes: ["app"] as PartnerTypeId[],
  },
  {
    label: "💬 告白する",
    icon: "💬",
    line: "「ずっと伝えたかったんだけど、あなたのことが好きです。付き合ってください」",
    context: "3ヶ月同じサークルで活動している同期",
    partnerTypes: ["school"] as PartnerTypeId[],
  },
  {
    label: "🌙 関係を深める",
    icon: "🌙",
    line: "「最近どう？久しぶりに会いたいな」という感じのLINEが来た",
    context: "元同僚で半年ぶりに連絡が来た",
    partnerTypes: ["workplace"] as PartnerTypeId[],
  },
  {
    label: "😰 既読スルー後",
    icon: "😰",
    line: "2日前のLINEに既読がついたまま返信が来ない",
    context: "付き合って3ヶ月の彼氏/彼女",
    partnerTypes: ["same"] as PartnerTypeId[],
  },
] as const;

function parseResult(text: string): Result {
  const get = (tag: string) => {
    const m = text.match(new RegExp(`===\\s*${tag}\\s*===\\s*([\\s\\S]*?)(?====|$)`));
    return m ? m[1].trim() : "";
  };
  const scoreStr = get("SCORE");
  const score = parseInt(scoreStr, 10);
  if (isNaN(score)) return null;
  const repliesRaw = get("REPLIES");
  const replies = repliesRaw.split(/\n(?=\d\.)/).map((s) => s.replace(/^\d\.\s*/, "").trim()).filter(Boolean);
  return {
    score,
    analysis: get("ANALYSIS"),
    replies,
    confession: get("CONFESSION"),
    timing: get("TIMING"),
    adviceLine: get("ADVICE"),
  };
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#ec4899" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "脈ありです！💓" : score >= 40 ? "まだわからない…" : "厳しいかも…";
  const hearts = score >= 70 ? ["💕", "💖", "💗"] : score >= 40 ? ["💛"] : [];
  const badge = score >= 70
    ? { text: "告白Go! 🔥", bg: "bg-pink-500", action: "今すぐ告白のチャンスです！返信例文タブを参考に気持ちを伝えましょう。" }
    : score >= 40
    ? { text: "もう少し！💛", bg: "bg-amber-500", action: "もう少しLINEを重ねて距離を縮めましょう。返信例文で会話を盛り上げて。" }
    : { text: "関係深化優先 💪", bg: "bg-red-600", action: "まずは共通の話題や会う機会を増やしましょう。焦らず関係を育てることが大切です。" };
  const isPulse = score >= 70;

  // スコア帯に応じたグラデーション背景
  const gradientBg = score >= 70
    ? "bg-gradient-to-br from-pink-900/60 via-rose-900/40 to-pink-950/60"
    : score >= 40
    ? "bg-gradient-to-br from-amber-900/40 via-pink-900/30 to-pink-950/60"
    : "bg-gradient-to-br from-red-900/40 via-pink-950/40 to-pink-950/60";

  return (
    <div className={`flex flex-col items-center gap-3 my-4 py-6 ${gradientBg} rounded-2xl border border-pink-700/50 relative overflow-hidden`}>
      {/* 背景装飾ハート（高スコア時） */}
      {isPulse && (
        <div className="absolute inset-0 pointer-events-none select-none">
          {["💓","💗","💕"].map((h, i) => (
            <span key={i} className="absolute text-4xl opacity-10 animate-ping"
              style={{ top: `${[15,55,30][i]}%`, left: `${[10,80,50][i]}%`, animationDelay: `${i * 0.4}s`, animationDuration: "2s" }}>{h}</span>
          ))}
        </div>
      )}

      {/* OGPカード風スコア表示 */}
      <div className="text-center relative z-10 px-4 w-full">
        {isPulse && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl animate-ping opacity-75">💓</span>
        )}
        {/* スコアメーター（円弧風） */}
        <div className="relative inline-flex items-center justify-center mb-2">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r="58" fill="none" stroke="#1e0a18" strokeWidth="12"/>
            <circle cx="70" cy="70" r="58" fill="none" stroke={color} strokeWidth="12"
              strokeDasharray={`${(score / 100) * 364} 364`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-black leading-none" style={{ color }}>{score}</p>
            <p className="text-lg font-bold opacity-70" style={{ color }}>%</p>
          </div>
        </div>
        <p className="text-sm text-pink-300 font-medium">脈あり確度: {score}%</p>
      </div>

      {hearts.length > 0 && (
        <div className={`flex gap-3 ${isPulse ? "animate-pulse" : "animate-bounce"}`}>
          {hearts.map((h, i) => (
            <span key={i} className="text-2xl" style={isPulse ? { animationDelay: `${i * 0.15}s` } : {}}>{h}</span>
          ))}
        </div>
      )}
      <span className="font-black text-xl" style={{ color }}>{label}</span>

      {/* 判定バッジ */}
      <span className={`${badge.bg} text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg${isPulse ? " animate-pulse" : ""}`}>{badge.text}</span>

      {/* スコア帯の意味を視覚的に補足 */}
      <div className="w-3/4 relative">
        <div className="bg-pink-900 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-1000${isPulse ? " animate-pulse" : ""}`}
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-pink-800 mt-1">
          <span>0% 脈なし</span><span>50% 様子見</span><span>100% 脈あり</span>
        </div>
      </div>

      {/* 次のアクション */}
      <div className="w-full px-4 bg-pink-950/60 border border-pink-800/50 rounded-xl p-3 mt-1">
        <p className="text-xs text-pink-200 font-bold mb-1">💡 次にやること</p>
        <p className="text-xs text-pink-300">{badge.action}</p>
      </div>
    </div>
  );
}

type Tab = "score" | "analysis" | "replies" | "confession" | "timing" | "history" | "planner";
const TABS: { id: Tab; label: string }[] = [
  { id: "score", label: "📊 判定" },
  { id: "replies", label: "💬 返信例文" },
  { id: "analysis", label: "🔍 心理分析" },
  { id: "confession", label: "💌 告白文" },
  { id: "timing", label: "📅 タイミング" },
  { id: "planner", label: "📋 作戦" },
  { id: "history", label: "📈 推移" },
];

type ScoreHistory = { score: number; date: string; context?: string };
const HISTORY_KEY = "kokuhaku_score_history";
const SAVED_REPLIES_KEY = "kokuhaku_saved_replies";

function loadSavedReplies(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(SAVED_REPLIES_KEY) ?? "[]"); } catch { return []; }
}
function toggleSavedReply(reply: string): string[] {
  const current = loadSavedReplies();
  const next = current.includes(reply) ? current.filter(r => r !== reply) : [...current, reply].slice(0, 10);
  localStorage.setItem(SAVED_REPLIES_KEY, JSON.stringify(next));
  return next;
}
function loadScoreHistory(): ScoreHistory[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}
function saveScoreHistory(score: number, ctx: string): ScoreHistory[] {
  const history = loadScoreHistory();
  const entry: ScoreHistory = { score, date: new Date().toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }), context: ctx.slice(0, 20) || undefined };
  const next = [...history, entry].slice(-10); // keep last 10
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

// 脈あり度推移グラフをCanvas APIで画像化してXシェア
function generateTrendShareCard(history: ScoreHistory[], avg: number, trend: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d')!;

  // 背景グラデーション
  const grad = ctx.createLinearGradient(0, 0, 0, 630);
  grad.addColorStop(0, '#2d0020');
  grad.addColorStop(1, '#1a0010');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 630);

  // タイトル
  ctx.fillStyle = '#f9a8d4';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('脈あり度 推移グラフ', 600, 60);

  // 統計3ボックス
  const boxes = [
    { label: '平均スコア', value: `${avg}%`, color: '#ec4899' },
    { label: 'トレンド', value: trend > 0 ? `↑+${trend}%` : trend < 0 ? `↓${trend}%` : '→変化なし', color: trend > 0 ? '#4ade80' : trend < 0 ? '#f87171' : '#f9a8d4' },
    { label: '診断回数', value: `${history.length}回`, color: '#c084fc' },
  ];
  boxes.forEach((b, i) => {
    const bx = 160 + i * 300;
    ctx.fillStyle = 'rgba(236,72,153,0.15)';
    ctx.beginPath();
    ctx.roundRect(bx, 90, 220, 80, 12);
    ctx.fill();
    ctx.fillStyle = b.color;
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(b.value, bx + 110, 138);
    ctx.fillStyle = '#9d174d';
    ctx.font = '18px sans-serif';
    ctx.fillText(b.label, bx + 110, 158);
  });

  // バーチャート描画
  const chartLeft = 80;
  const chartRight = 1120;
  const chartTop = 200;
  const chartBottom = 520;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;
  const maxScore = Math.max(...history.map(h => h.score), 100);
  const barW = Math.min(80, Math.floor(chartW / history.length) - 12);

  history.forEach((h, i) => {
    const x = chartLeft + (i / Math.max(history.length - 1, 1)) * chartW;
    const barHeight = Math.round((h.score / maxScore) * chartH);
    const color = h.score >= 70 ? '#ec4899' : h.score >= 40 ? '#f59e0b' : '#ef4444';

    // バー
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x - barW / 2, chartBottom - barHeight, barW, barHeight, [6, 6, 0, 0]);
    ctx.fill();

    // スコアラベル
    ctx.fillStyle = color;
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${h.score}`, x, chartBottom - barHeight - 8);

    // 日付ラベル
    ctx.fillStyle = '#9d174d';
    ctx.font = '14px sans-serif';
    ctx.fillText(h.date.split(' ')[0], x, chartBottom + 22);
  });

  // 軸線
  ctx.strokeStyle = 'rgba(236,72,153,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(chartLeft, chartBottom);
  ctx.lineTo(chartRight, chartBottom);
  ctx.stroke();

  // フッター
  ctx.fillStyle = '#e91e63';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('告白LINE返信AI | kokuhaku-line-ai.vercel.app', 600, 590);

  return canvas.toDataURL('image/png');
}

function ScoreTrendGraph({ history }: { history: ScoreHistory[] }) {
  const [graphCopied, setGraphCopied] = useState(false);

  const handleShareGraph = useCallback(async (avg: number, trend: number) => {
    try {
      const dataUrl = generateTrendShareCard(history, avg, trend);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setGraphCopied(true);
      setTimeout(() => setGraphCopied(false), 3000);
    } catch {
      const dataUrl = generateTrendShareCard(history, avg, trend);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `myakuari_trend_${avg}avg.png`;
      a.click();
      setGraphCopied(true);
      setTimeout(() => setGraphCopied(false), 3000);
    }
  }, [history]);

  if (history.length === 0) return (
    <div className="py-12 text-center text-pink-500 text-sm">まだ診断履歴がありません<br /><span className="text-xs text-pink-700 mt-1 block">診断するたびにここに記録されます</span></div>
  );
  const max = Math.max(...history.map(h => h.score), 100);
  const avg = Math.round(history.reduce((s, h) => s + h.score, 0) / history.length);
  const trend = history.length >= 2 ? history[history.length - 1].score - history[0].score : 0;
  const latest = history[history.length - 1];
  return (
    <div className="space-y-4">
      <div className="flex gap-3 text-center">
        <div className="flex-1 bg-pink-900/40 rounded-xl p-3">
          <p className="text-2xl font-black text-pink-300">{avg}%</p>
          <p className="text-xs text-pink-600">平均スコア</p>
        </div>
        <div className="flex-1 bg-pink-900/40 rounded-xl p-3">
          <p className={`text-2xl font-black ${trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-pink-300"}`}>{trend > 0 ? `↑+${trend}` : trend < 0 ? `↓${trend}` : "→0"}%</p>
          <p className="text-xs text-pink-600">初回→最新</p>
        </div>
        <div className="flex-1 bg-pink-900/40 rounded-xl p-3">
          <p className="text-2xl font-black text-pink-300">{history.length}</p>
          <p className="text-xs text-pink-600">診断回数</p>
        </div>
      </div>
      {/* Bar chart */}
      <div className="bg-pink-950/60 border border-pink-800/40 rounded-xl p-4">
        <p className="text-xs text-pink-500 mb-3 font-bold">脈あり度の変化（最新10回）</p>
        <div className="flex items-end gap-1.5 h-28">
          {history.map((h, i) => {
            const barH = Math.round((h.score / max) * 100);
            const color = h.score >= 70 ? "#ec4899" : h.score >= 40 ? "#f59e0b" : "#ef4444";
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[9px] font-bold" style={{ color }}>{h.score}</span>
                <div className="w-full rounded-t transition-all duration-500" style={{ height: `${barH}%`, backgroundColor: color, minHeight: 4 }} />
                <span className="text-[8px] text-pink-700 leading-none">{h.date.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-pink-800">
          <span>古い</span><span>新しい →</span>
        </div>
      </div>
      {/* グラフXシェアボタン */}
      {history.length >= 2 && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleShareGraph(avg, trend)}
            aria-label="脈あり度推移グラフを画像コピーしてXにシェアする"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-700 to-pink-800 hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md"
          >
            {graphCopied ? '✅ グラフ画像コピー完了！Xに貼り付けてシェアしよう' : '📊 脈あり度推移グラフを画像コピー→Xへ'}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`【脈あり度推移】${history.length}回診断した結果\n平均${avg}% ${trend > 0 ? `↑${trend}%上昇中` : trend < 0 ? `↓${trend}%` : "安定中"}💕\n最新: ${latest.score}%\n#告白LINE #脈あり #恋愛\nhttps://kokuhaku-line-ai.vercel.app`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            推移グラフをテキストでXシェア
          </a>
        </div>
      )}
      {/* Recent list */}
      <div className="space-y-1.5">
        {[...history].reverse().slice(0, 5).map((h, i) => (
          <div key={i} className="flex items-center gap-3 bg-pink-950/40 rounded-lg px-3 py-2">
            <span className="text-lg font-black" style={{ color: h.score >= 70 ? "#ec4899" : h.score >= 40 ? "#f59e0b" : "#ef4444" }}>{h.score}%</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${h.score >= 70 ? "bg-pink-500 text-white" : h.score >= 40 ? "bg-amber-500 text-white" : "bg-red-600 text-white"}`}>
              {h.score >= 70 ? "脈あり" : h.score >= 40 ? "様子見" : "厳しい"}
            </span>
            <span className="text-xs text-pink-600 ml-auto">{h.date}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => { localStorage.removeItem(HISTORY_KEY); window.location.reload(); }}
        aria-label="脈あり度診断履歴をすべてリセットして削除する"
        className="text-xs text-pink-800 hover:text-pink-600 w-full text-center mt-2"
      >🗑 履歴をリセット</button>
    </div>
  );
}

export default function ToolPage() {
  const [line, setLine] = useState("");
  const [context, setContext] = useState("");
  const [partnerTypes, setPartnerTypes] = useState<PartnerTypeId[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tab, setTab] = useState<Tab>("replies");
  const [copied, setCopied] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [completionVisible, setCompletionVisible] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [savedReplies, setSavedReplies] = useState<string[]>([]);
  const [savedNotif, setSavedNotif] = useState<string | null>(null);
  const [cardCopied, setCardCopied] = useState(false);

  const handleShareCard = useCallback(async (score: number) => {
    try {
      const dataUrl = generateShareCard(score);
      // Blob変換してClipboard APIでコピー
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCardCopied(true);
      setTimeout(() => setCardCopied(false), 3000);
    } catch {
      // Clipboard API非対応ブラウザはダウンロードにフォールバック
      const dataUrl = generateShareCard(score);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `myakuari_${score}percent.png`;
      a.click();
      setCardCopied(true);
      setTimeout(() => setCardCopied(false), 3000);
    }
  }, []);

  function togglePartnerType(id: PartnerTypeId) {
    setPartnerTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }
  useEffect(() => {
    setScoreHistory(loadScoreHistory());
    setSavedReplies(loadSavedReplies());
    fetch("/api/auth/status").then((r) => r.json()).then((d) => {
      setIsPremium(d.premium);
      setRemaining(d.remaining);
    });
  }, []);

  async function analyze() {
    if (!line.trim()) return;
    track('ai_generated', { service: '告白LINE返信AI' });
    setLoading(true);
    setError("");
    setResult(null);
    setRawText("");
    try {
      const partnerTypeLabels = partnerTypes
        .map((id) => PARTNER_TYPES.find((t) => t.id === id)?.label ?? "")
        .filter(Boolean);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line, context, partnerTypes: partnerTypeLabels }),
      });
      if (res.status === 402) { track('paywall_shown', { service: '告白LINE返信AI' }); setShowPaywall(true); setLoading(false); return; }
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "エラーが発生しました");
        setLoading(false);
        return;
      }
      // Streaming受信
      const reader = res.body?.getReader();
      if (!reader) throw new Error("stream unavailable");
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setRawText(fullText);
      }
      // remainingをヘッダーから取得
      const remainingHeader = res.headers.get("X-Remaining");
      if (remainingHeader !== null && remainingHeader !== "unlimited") {
        setRemaining(parseInt(remainingHeader, 10));
      } else if (remainingHeader === "unlimited") {
        setRemaining(null);
      }
      const parsed = parseResult(fullText);
      setResult(parsed);
      if (parsed) {
        const updated = saveScoreHistory(parsed.score, context);
        setScoreHistory(updated);
      }
      setTab("replies");
      // 達成感バナー表示
      setCompletionVisible(true);
      setTimeout(() => setCompletionVisible(false), 4000);
    } catch {
      setError("少し時間を置いてもう一度お試しください 🙏");
    }
    setLoading(false);
  }

  const [showPayjp, setShowPayjp] = useState(false);
  const startCheckout = () => setShowPayjp(true);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function CopyBtnInline({ text, keyName }: { text: string; keyName: string }) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => copy(text, keyName)}
          aria-label="テキストをクリップボードにコピーする"
          className="text-xs text-slate-500 hover:text-slate-300 shrink-0 pb-1 transition"
        >
          {copied === keyName ? "✓" : "コピー"}
        </button>
        {copied === keyName && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg animate-bounce">
            ✅ コピー完了！
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-950 via-rose-950 to-pink-950 text-white">
      <nav className="bg-pink-950/80 border-b border-pink-800/50 px-6 py-4 flex justify-between items-center backdrop-blur-sm">
        <Link href="/" className="font-bold text-pink-300">💕 恋愛コーチAI</Link>
        {!isPremium && remaining !== null && (
          <span className="text-xs text-slate-400">残り無料 {remaining}回</span>
        )}
        {isPremium && <span className="text-xs text-blue-400 font-bold">✓ プレミアム</span>}
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* シチュエーション別クイック選択 */}
        <div>
          <p className="text-sm font-bold text-pink-300 mb-2">💕 シチュエーションから選ぶ（ワンタップで入力）</p>
          <div className="grid grid-cols-2 gap-2">
            {SITUATION_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setLine(preset.line);
                  setContext(preset.context);
                  setPartnerTypes([...preset.partnerTypes]);
                }}
                aria-label={`シチュエーション「${preset.label.replace(/^.{2}/, "")}」のサンプルデータを入力欄にセットする`}
                className="text-left text-xs bg-pink-900/40 hover:bg-pink-800/60 border border-pink-700/40 hover:border-pink-500 text-pink-200 hover:text-white px-3 py-2.5 rounded-xl transition-all"
              >
                <span className="text-base mr-1.5">{preset.icon}</span>
                <span className="font-medium">{preset.label.replace(/^.{2}/, "")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LINEトーク画面プレビューUI */}
        <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
          {/* LINEグリーンヘッダー */}
          <div className="bg-green-500 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">💚</div>
            <div>
              <p className="text-white font-bold text-sm">LINE トーク</p>
              <p className="text-green-100 text-xs">気になる相手のLINEを下に貼り付けよう</p>
            </div>
          </div>
          {/* サンプルトーク */}
          <div className="bg-slate-900 px-4 py-3 space-y-2">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs shrink-0">😊</div>
              <div className="bg-white text-gray-800 rounded-2xl rounded-tl-sm px-3 py-2 text-xs max-w-[70%]">「今日暇だったりする？笑」</div>
            </div>
            <div className="flex items-end justify-end gap-2">
              <div className="bg-green-500 text-white rounded-2xl rounded-tr-sm px-3 py-2 text-xs max-w-[70%]">← あなたはなんて返す？</div>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="line-input" className="block text-sm font-bold mb-2 text-slate-300">好きな子のLINE（コピペしてください）</label>
          {/* 感情プリセットボタン */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { label: "😊 好意サイン", text: "最近よく連絡くれるし、二人でご飯行こうって言ってくれた。脈ありかな…" },
              { label: "💬 既読スルー", text: "既読ついたのに3日間返信がない。どうすればいい？" },
              { label: "🤔 曖昧な返信", text: "「いつか行こうね」って言われたけど、具体的な日程を言ってくれない" },
              { label: "😰 告白前", text: "明日告白しようと思ってるんだけど、このLINEの文面で大丈夫かな？" },
              { label: "💔 振られた後", text: "先日告白して振られたけど、「友達として仲良くしたい」って言われた" },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setLine(preset.text)}
                aria-label={`プリセット「${preset.label.replace(/^.{2}/, "")}」のサンプルテキストを入力欄にセットする`}
                className="text-xs bg-pink-900/60 hover:bg-pink-800/80 border border-pink-700/50 hover:border-pink-500 text-pink-200 hover:text-white px-3 py-1.5 rounded-full transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <textarea
            id="line-input"
            aria-label="解析したいLINEのトーク内容を入力してください"
            className="w-full bg-pink-950/60 border border-pink-700/50 rounded-xl p-4 text-sm text-white placeholder-pink-400/50 resize-none focus:outline-none focus:border-pink-400 h-40"
            placeholder={"例）\n彼女: 「今日バイトだよー」\n自分: 「お疲れ！何時まで？」\n彼女: 「9時まで笑 なんで？」\n自分: 「いや別に笑」\n彼女: 「気になる笑」"}
            value={line}
            onChange={(e) => setLine(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="context-input" className="block text-sm font-bold mb-2 text-slate-300">関係性・状況（任意）</label>
          <input
            id="context-input"
            type="text"
            aria-label="相手との関係性や状況を入力してください（任意）"
            className="w-full bg-pink-950/60 border border-pink-700/50 rounded-xl p-4 text-sm text-white placeholder-pink-400/50 focus:outline-none focus:border-pink-400"
            placeholder="例：クラスメートで知り合って1ヶ月、まだ連絡先交換したばかり"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        {/* 相手のタイプ選択 */}
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-300">
            相手のタイプ <span className="text-pink-600 font-normal text-xs">（任意・複数選択可）</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PARTNER_TYPES.map((pt) => {
              const active = partnerTypes.includes(pt.id);
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => togglePartnerType(pt.id)}
                  aria-label={`相手のタイプ「${pt.label.replace(/^.{2}/, "")}」を${active ? "選択解除" : "選択"}する`}
                  aria-pressed={active}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    active
                      ? "bg-pink-500 border-pink-400 text-white shadow-md shadow-pink-900/40"
                      : "bg-pink-950/60 border-pink-700/50 text-pink-300 hover:bg-pink-800/60 hover:border-pink-500"
                  }`}
                >
                  {pt.label}
                </button>
              );
            })}
          </div>
        </div>

        {!isPremium && remaining === 0 && !result && (
          <div className="bg-blue-900/40 border border-blue-600 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-200 mb-3">無料体験が完了しました。プレミアムプランで制限なく使えます！</p>
            <KomojuButton
              planId="standard"
              planLabel="プレミアムにアップグレード"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-bold px-6 py-2 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading || !line.trim() || (!isPremium && remaining === 0)}
          aria-label="入力したLINEの内容をAIで解析して脈あり度を判定する"
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black py-4 rounded-xl text-lg transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-pink-900/50"
        >
          {loading ? "AIが解析中…" : "解析する"}
        </button>

        {loading && !rawText && (
          <div className="bg-pink-950/60 border border-pink-700/50 rounded-xl p-5 text-center">
            <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-pink-300 font-medium text-sm mb-1">AIが解析中...</p>
            <p className="text-xs text-pink-400">💕 LINE文面分析 → 🔍 脈あり度判定 → 💬 返信パターン生成</p>
            <p className="text-xs text-pink-600 mt-1">通常5〜10秒かかります</p>
          </div>
        )}
        {loading && rawText && (
          <div className="bg-pink-950/60 border border-pink-700/50 rounded-xl p-4">
            <p className="text-xs text-pink-400 mb-2 font-bold animate-pulse">💕 AIが解析中...</p>
            <p className="text-sm text-pink-100 leading-relaxed whitespace-pre-wrap">{rawText}</p>
          </div>
        )}

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Paywall */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center relative">
              <button onClick={() => setShowPaywall(false)} aria-label="無料枠上限モーダルを閉じる" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
              <div className="text-3xl mb-3">⭐</div>
              <h2 className="text-lg font-bold mb-2">無料枠を使い切りました</h2>
              <p className="text-sm text-gray-500 mb-4">プレミアムプランで全機能を使えます</p>
              <KomojuButton
                planId="standard"
                planLabel="プレミアム ¥980/月を始める"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
              <button onClick={() => setShowPaywall(false)} aria-label="無料枠上限モーダルを閉じてツール画面に戻る" className="text-xs text-gray-400 hover:text-gray-600 mt-3 block w-full">閉じる</button>
            </div>
          </div>
        )}

        {/* 達成感バナー */}
        {result && (
          <div className={`transition-all duration-500 overflow-hidden ${completionVisible ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl px-5 py-4 shadow-lg mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-heart-pop">✅</span>
                <div>
                  <p className="font-bold text-sm">解析完了！</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs opacity-80">脈あり度</span>
                    <div className="flex-1 bg-white/20 rounded-full h-2 min-w-[80px]">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-700"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{result.score}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-2 flex flex-col gap-3 animate-fade-in-up">
            {/* シェアカード生成ボタン */}
            <button
              onClick={() => handleShareCard(result.score)}
              aria-label="脈あり度診断結果カードを画像コピーしてXにシェアする"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-600 to-pink-700 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg"
            >
              {cardCopied ? '✅ カードをコピーしました！Xに貼り付けてシェアしよう' : '🖼️ 脈あり度カードを画像コピー→Xへ'}
            </button>
            {/* Xシェアボタン — 脈あり度スコア入り */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`告白LINE AI診断で脈あり${result.score}%でした！💕\n#告白LINE #脈あり診断\nhttps://kokuhaku-line-ai.vercel.app`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition"
            >
              💓 脈あり{result.score}%をXでシェアする
            </a>
            {/* 占いAIバナー */}
            <div className="p-4 bg-gradient-to-r from-pink-900/30 to-rose-900/30 border border-pink-500/30 rounded-xl text-center">
              <p className="text-pink-300 text-sm font-medium mb-2">🔮 運命の相手との相性も気になる？</p>
              <p className="text-slate-400 text-xs mb-3">タロット・星座・数秘術で恋愛運・出会い運を AI が鑑定します</p>
              <a href="https://uranai-ai-sigma.vercel.app" target="_blank" rel="noopener noreferrer"
                 className="inline-block px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-lg transition-colors">
                占いAIを試す（無料）→
              </a>
            </div>
          </div>
        )}

        {result && (
          <>
          <div className="bg-pink-950/60 rounded-2xl border border-pink-700/40 overflow-hidden">
            {/* Tab nav */}
            <div className="flex overflow-x-auto border-b border-pink-800/50" role="tablist" aria-label="解析結果タブ">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  role="tab"
                  aria-selected={tab === t.id}
                  aria-label={`${t.label}タブを表示する`}
                  className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition ${tab === t.id ? "text-pink-300 border-b-2 border-pink-400" : "text-pink-500/60 hover:text-pink-300"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="px-6 pt-4 text-right">
              <button
                onClick={analyze}
                disabled={loading || !line.trim()}
                aria-label="別のパターンでAI解析を再実行する"
                className="text-sm text-slate-400 underline hover:text-slate-200 disabled:opacity-40"
              >
                🔄 別のパターンで再生成
              </button>
            </div>

            <div className="p-6">
              {tab === "score" && (
                <div>
                  <ScoreRing score={result.score} />
                  {result.adviceLine && (
                    <div className="bg-slate-800 rounded-xl p-4 mt-4">
                      <p className="text-sm text-slate-300 leading-relaxed">{result.adviceLine}</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleShareCard(result.score)}
                    aria-label="スコアタブで脈あり度カードを画像コピーしてXにシェアする"
                    className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-600 to-pink-700 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg"
                  >
                    {cardCopied ? '✅ コピー完了！Xに貼り付けてシェア' : '🖼️ 結果カードを画像コピー→Xへ'}
                  </button>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`告白LINE AI診断で脈あり${result.score}%でした！💕\n#告白LINE #脈あり診断\nhttps://kokuhaku-line-ai.vercel.app`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-opacity">
                    脈あり{result.score}%をXでシェア 🔥
                  </a>
                </div>
              )}

              {tab === "analysis" && (
                <div className="text-sm text-pink-100 leading-relaxed whitespace-pre-wrap">{result.analysis}</div>
              )}

              {tab === "replies" && (
                <div className="space-y-5">
                  {/* LINEトーク風ヘッダー */}
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white shrink-0">AI</div>
                    <span className="text-xs text-slate-400">送るならどれ？ — そのままコピーしてOK</span>
                  </div>
                  {/* シナリオ分岐ラベル */}
                  <div className="flex flex-wrap gap-2 pb-1">
                    {[
                      { label: "💘 積極的に受け入れる", color: "bg-pink-500/20 border-pink-500/50 text-pink-300" },
                      { label: "💛 まだ考えたい（様子見）", color: "bg-amber-500/20 border-amber-500/50 text-amber-300" },
                      { label: "🤍 丁寧に断る", color: "bg-slate-500/20 border-slate-500/50 text-slate-300" },
                    ].map((s) => (
                      <span key={s.label} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${s.color}`}>{s.label}</span>
                    ))}
                  </div>
                  {result.replies.map((r, i) => {
                    const labels = ["想いを受け入れる返信", "様子見・時間を作る返信", "丁寧に断る返信"];
                    const labelColors = ["text-pink-400", "text-amber-400", "text-slate-400"];
                    const bgColors = ["bg-pink-500", "bg-amber-500", "bg-slate-600"];
                    // 本文と補足説明を分割（「なぜ効果的か」の説明部分を分ける）
                    const lines = r.split(/\n/);
                    const mainLine = lines[0] ?? r;
                    const subLines = lines.slice(1).join("\n").trim();
                    const isSaved = savedReplies.includes(mainLine);
                    return (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between ml-1">
                          <span className={`text-xs font-bold ${labelColors[i] ?? "text-slate-400"}`}>
                            {i + 1}. {labels[i] ?? "返信例"}
                          </span>
                          <button
                            onClick={() => {
                              const updated = toggleSavedReply(mainLine);
                              setSavedReplies(updated);
                              setSavedNotif(isSaved ? null : mainLine);
                              setTimeout(() => setSavedNotif(null), 2000);
                            }}
                            aria-label={isSaved ? "この返信例文をお気に入りから削除する" : "この返信例文をお気に入りに保存する"}
                            aria-pressed={isSaved}
                            className={`text-xs px-2 py-0.5 rounded-full transition font-bold ${isSaved ? "bg-pink-500/20 text-pink-300 border border-pink-500/40" : "text-slate-500 hover:text-pink-400 border border-slate-600/40"}`}
                          >
                            {isSaved ? "💖 保存済み" : "♡ 保存"}
                          </button>
                        </div>
                        {savedNotif === mainLine && (
                          <div className="text-center text-xs text-pink-300 animate-bounce">💖 お気に入りに保存しました！</div>
                        )}
                        {/* LINE吹き出し（右側・自分の送信） */}
                        <div className="flex justify-end items-end gap-2">
                          <button
                            onClick={() => copy(mainLine, `reply-${i}`)}
                            aria-label={`${i + 1}番目の返信例文をクリップボードにコピーする`}
                            className="text-xs text-slate-500 hover:text-slate-300 shrink-0 pb-1 transition"
                          >
                            {copied === `reply-${i}` ? "✓" : "コピー"}
                          </button>
                          <div className={`relative max-w-[85%] ${bgColors[i] ?? "bg-pink-500"} text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md`}>
                            <p className="text-sm leading-relaxed">{mainLine}</p>
                            {/* 吹き出し三角 */}
                            <div className={`absolute top-3 -right-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 ${bgColors[i] === "bg-pink-500" ? "border-l-pink-500" : bgColors[i] === "bg-blue-500" ? "border-l-blue-500" : "border-l-purple-500"}`} />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs shrink-0">😊</div>
                        </div>
                        {/* 補足説明（グレーテキスト） */}
                        {subLines && (
                          <p className="text-xs text-slate-500 text-right mr-12 leading-relaxed italic">{subLines}</p>
                        )}
                      </div>
                    );
                  })}
                  {/* お気に入り返信一覧 */}
                  {savedReplies.length > 0 && (
                    <div className="mt-4 border-t border-pink-800/40 pt-4">
                      <p className="text-xs font-bold text-pink-300 mb-2">💖 お気に入りの返信</p>
                      <div className="space-y-2">
                        {savedReplies.map((reply, i) => (
                          <div key={i} className="flex items-start gap-2 bg-pink-950/40 border border-pink-800/30 rounded-xl px-3 py-2">
                            <p className="text-xs text-pink-200 flex-1 leading-relaxed">{reply}</p>
                            <button
                              onClick={() => copy(reply, `saved-${i}`)}
                              className="text-xs text-slate-500 hover:text-slate-300 shrink-0 transition"
                            >
                              {copied === `saved-${i}` ? "✓" : "コピー"}
                            </button>
                            <button
                              onClick={() => { const updated = toggleSavedReply(reply); setSavedReplies(updated); }}
                              className="text-xs text-slate-600 hover:text-red-400 shrink-0 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 text-center pt-2">💬 送りたい文をコピーして、そのままLINEに貼り付けよう</p>
                  {/* 返信まとめコピーボタン */}
                  <button
                    aria-label="3パターンの返信例文をまとめてクリップボードにコピーする"
                    onClick={() => {
                      const text = result.replies.map((r, i) => {
                        const labels = ["【積極的】", "【様子見】", "【断る】"];
                        return `${labels[i] ?? ""} ${r.split("\n")[0]}`;
                      }).join("\n");
                      copy(`脈あり度: ${result.score}%\n\n${text}\n\n▶ 告白LINE返信AI https://kokuhaku-line-ai.vercel.app`, "all-replies");
                    }}
                    className="w-full mt-2 py-2.5 border border-pink-700/40 text-pink-400 hover:text-pink-200 hover:bg-pink-900/30 text-xs font-bold rounded-xl transition"
                  >
                    {copied === "all-replies" ? "✓ コピー完了！" : "📋 3パターンをまとめてコピー（SNSシェア用）"}
                  </button>
                </div>
              )}

              {tab === "confession" && (
                isPremium ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 mb-4">告白文（そのまま使えます）</p>
                    <div className="bg-slate-800 rounded-xl p-4 relative">
                      <p className="text-sm text-slate-200 leading-relaxed pr-16 whitespace-pre-wrap">{result.confession}</p>
                      <button
                        onClick={() => copy(result.confession, "confession")}
                        className="absolute top-3 right-3 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition"
                      >
                        {copied === "confession" ? "コピー済" : "コピー"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔒</div>
                    <p className="text-slate-400 text-sm mb-4">告白文テンプレはプレミアムプラン（¥980/月）限定機能です</p>
                    <KomojuButton
                      planId="standard"
                      planLabel="¥980/月でアップグレード"
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                )
              )}

              {tab === "timing" && (
                <div className="text-sm text-pink-100 leading-relaxed whitespace-pre-wrap">{result.timing}</div>
              )}

              {tab === "planner" && (
                <div className="space-y-4">
                  <p className="text-xs text-pink-400 mb-4">脈あり度{result.score}%に基づいた、次の一手を提案します。</p>
                  {/* 次の会話ネタ3選 */}
                  <div>
                    <p className="text-xs font-bold text-pink-300 mb-2">💬 次に使える会話ネタ3選</p>
                    <div className="space-y-2">
                      {((): { icon: string; text: string; action: string }[] => {
                        if (result.score >= 70) return [
                          { icon: "🎯", text: "「今度の週末、一緒に〇〇行かない？」とデートに誘う", action: "積極的" },
                          { icon: "📸", text: "共通の趣味・話題で「これ見たとき〇〇思い出した」と送る", action: "自然" },
                          { icon: "🌙", text: "夜に「最近どう？」と軽く連絡して会話の糸口を作る", action: "ゆっくり" },
                        ];
                        if (result.score >= 40) return [
                          { icon: "😊", text: "相手の好きなものについて「詳しく教えて！」と聞く", action: "距離縮め" },
                          { icon: "🎭", text: "2人が関係する出来事・ニュースをネタに会話する", action: "共通点" },
                          { icon: "☕", text: "「〇〇に行ったんだけどよかったよ」と間接的にデートを提案", action: "間接的" },
                        ];
                        return [
                          { icon: "🌱", text: "共通の友達を通じて自然な接点を作る", action: "基盤作り" },
                          { icon: "📖", text: "相手の趣味・興味分野の話題から始める", action: "興味を示す" },
                          { icon: "👥", text: "グループでの集まりで接点を増やす", action: "焦らない" },
                        ];
                      })().map((item, i) => (
                        <div key={i} className="flex items-start gap-3 bg-pink-950/50 border border-pink-800/40 rounded-xl p-3">
                          <span className="text-xl leading-none shrink-0">{item.icon}</span>
                          <div className="flex-1">
                            <p className="text-xs text-pink-100">{item.text}</p>
                            <span className="text-[10px] bg-pink-700/50 text-pink-300 px-2 py-0.5 rounded-full mt-1 inline-block">{item.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 告白成功チェックリスト */}
                  <div>
                    <p className="text-xs font-bold text-pink-300 mb-2">✅ 告白成功率を上げる5つのチェックリスト</p>
                    <div className="space-y-1.5">
                      {[
                        { check: result.score >= 50, label: "脈あり度50%以上", detail: result.score >= 50 ? "クリア！告白のチャンスあり" : `現在${result.score}%。もう少し距離を縮めよう` },
                        { check: false, label: "2人きりになれる状況を作った", detail: "次のLINEでさりげなく2人の時間を提案してみよう" },
                        { check: false, label: "相手の好きなものを3つ知っている", detail: "共通の話題が増えると一気に距離が縮まる" },
                        { check: false, label: "最後に会ってから3週間以内", detail: "時間が空きすぎると熱が冷めやすい。接触頻度を保って" },
                        { check: false, label: "告白する場所・タイミングを決めた", detail: "「いつか」は「永遠に来ない」。具体的に決めよう" },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${item.check ? "bg-green-900/20 border border-green-700/30" : "bg-pink-950/40 border border-pink-800/30"}`}>
                          <span className={`shrink-0 text-sm ${item.check ? "text-green-400" : "text-pink-700"}`}>{item.check ? "✅" : "⬜"}</span>
                          <div>
                            <p className={`text-xs font-bold ${item.check ? "text-green-300" : "text-pink-300"}`}>{item.label}</p>
                            <p className="text-[11px] text-pink-500/80">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 次のLINEを送るベスト時間 */}
                  <div className="bg-pink-950/50 border border-pink-800/40 rounded-xl p-3">
                    <p className="text-xs font-bold text-pink-300 mb-2">🕐 次のLINEを送るベストタイミング</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { time: "21:00-22:00", label: "夜", reason: "1日の終わりでリラックス中。返信率最高", star: true },
                        { time: "07:30-08:30", label: "朝", reason: "通勤・通学中。スマホを見る時間帯", star: false },
                        { time: "12:15-13:00", label: "昼休み", reason: "昼食中のスマホチェックタイム", star: false },
                      ].map((t, i) => (
                        <div key={i} className={`text-center p-2 rounded-lg ${t.star ? "bg-pink-500/20 border border-pink-500/40" : "bg-pink-950/60 border border-pink-800/30"}`}>
                          <p className={`text-xs font-black ${t.star ? "text-pink-300" : "text-pink-500"}`}>{t.time}</p>
                          <p className={`text-[10px] font-bold ${t.star ? "text-pink-200" : "text-pink-600"}`}>{t.label}{t.star && " 🔥"}</p>
                          <p className="text-[9px] text-pink-700 leading-tight mt-0.5">{t.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "history" && (
                <ScoreTrendGraph history={scoreHistory} />
              )}
            </div>
          </div>
          {/* 次のアクション3選 */}
          <div className="mt-4 bg-pink-950/30 border border-pink-500/30 rounded-xl p-4">
            <p className="text-sm font-bold text-pink-300 mb-3">💓 次にやるべきこと3選</p>
            <ol className="space-y-2">
              {[
                { icon: "💬", text: "「返信例文」タブのパターンを1つ選んで今すぐ送ってみる" },
                { icon: "📅", text: "「告白タイミング」タブを確認して具体的な日程を決める" },
                { icon: "📝", text: "相手の返信内容・反応を記録して次の分析に活かす" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-pink-100">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{i + 1}. {item.text}</span>
                </li>
              ))}
            </ol>
            {/* A8.net アフィリエイト — 告白後のデートに備えて体型ケア */}
            <div className="mt-4 pt-3 border-t border-pink-700/30">
              <p className="text-xs text-pink-400 mb-2">💪 告白後のデートに備えて</p>
              <a
                href="https://px.a8.net/svt/ejp?a8mat=4AZIOF+8OKLDE+4EPM+63OY9"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-3 bg-pink-800/40 hover:bg-pink-800/60 border border-pink-600/40 rounded-xl px-4 py-3 transition-colors"
              >
                <span className="text-2xl">🧘‍♀️</span>
                <div>
                  <p className="text-sm font-bold text-pink-200">SOELUオンラインヨガで体型ケア</p>
                  <p className="text-xs text-pink-400">告白後のデートに向けて、自宅でヨガ・フィットネス</p>
                </div>
                <span className="ml-auto text-pink-400 text-xs shrink-0">→</span>
              </a>
            </div>
          </div>
          </>
        )}
      </div>

      <footer className="border-t border-pink-900/50 py-6 text-center text-xs text-pink-800 space-x-4 mt-10">
        <Link href="/legal" className="hover:underline">特定商取引法</Link>
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
        <Link href="/" className="hover:underline">トップへ戻る</Link>
      </footer>
      {showPayjp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" role="dialog" aria-modal="true" aria-labelledby="tool-premium-modal-title">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
            <button onClick={() => setShowPayjp(false)} aria-label="プレミアムプランモーダルを閉じる" className="absolute top-3 right-3 text-gray-400 text-xl">✕</button>
            <div className="text-3xl mb-3 text-center">💌</div>
            <h2 id="tool-premium-modal-title" className="text-lg font-bold mb-2 text-center">プレミアムプラン</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">LINE解析 無制限+高精度</p>
            <KomojuButton planId="standard" planLabel="プレミアムプラン ¥980/月" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50" />
          </div>
        </div>
      )}
    </main>
  );
}
