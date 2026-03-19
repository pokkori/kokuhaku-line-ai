"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import KomojuButton from "@/components/KomojuButton";
import { track } from '@vercel/analytics';

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
  return (
    <div className="flex flex-col items-center gap-3 my-4 py-6 bg-pink-900/40 rounded-2xl border border-pink-700/50">
      {/* 大型スコア中央表示 */}
      <div className="text-center relative">
        {isPulse && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl animate-ping opacity-75">💓</span>
        )}
        <p className="text-6xl font-black" style={{ color }}>{score}<span className="text-3xl font-bold opacity-70">%</span></p>
        <p className="text-sm text-pink-300 mt-1 font-medium">脈あり確度: {score}%</p>
      </div>
      {hearts.length > 0 && (
        <div className={`flex gap-3 ${isPulse ? "animate-pulse" : "animate-bounce"}`}>
          {hearts.map((h, i) => (
            <span
              key={i}
              className="text-2xl"
              style={isPulse ? { animationDelay: `${i * 0.15}s` } : {}}
            >{h}</span>
          ))}
        </div>
      )}
      <span className="font-black text-xl" style={{ color }}>{label}</span>
      {/* 判定バッジ */}
      <span className={`${badge.bg} text-white text-sm font-black px-4 py-1.5 rounded-full shadow-lg${isPulse ? " animate-pulse" : ""}`}>{badge.text}</span>
      {/* プログレスバー */}
      <div className="w-3/4 bg-pink-900 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-1000${isPulse ? " animate-pulse" : ""}`}
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-pink-400">{score}点 / 100点満点</p>
      {/* 次のアクション */}
      <div className="w-full px-4 bg-pink-950/60 border border-pink-800/50 rounded-xl p-3 mt-1">
        <p className="text-xs text-pink-200 font-bold mb-1">💡 次にやること</p>
        <p className="text-xs text-pink-300">{badge.action}</p>
      </div>
    </div>
  );
}

type Tab = "score" | "analysis" | "replies" | "confession" | "timing" | "history";
const TABS: { id: Tab; label: string }[] = [
  { id: "score", label: "📊 判定" },
  { id: "analysis", label: "🔍 心理分析" },
  { id: "replies", label: "💬 返信例文" },
  { id: "confession", label: "💌 告白文" },
  { id: "timing", label: "📅 タイミング" },
  { id: "history", label: "📈 推移" },
];

type ScoreHistory = { score: number; date: string; context?: string };
const HISTORY_KEY = "kokuhaku_score_history";
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

function ScoreTrendGraph({ history }: { history: ScoreHistory[] }) {
  if (history.length === 0) return (
    <div className="py-12 text-center text-pink-500 text-sm">まだ診断履歴がありません<br /><span className="text-xs text-pink-700 mt-1 block">診断するたびにここに記録されます</span></div>
  );
  const max = Math.max(...history.map(h => h.score), 100);
  const avg = Math.round(history.reduce((s, h) => s + h.score, 0) / history.length);
  const trend = history.length >= 2 ? history[history.length - 1].score - history[0].score : 0;
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

  function togglePartnerType(id: PartnerTypeId) {
    setPartnerTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }
  useEffect(() => {
    setScoreHistory(loadScoreHistory());
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
          className="text-xs text-slate-500 hover:text-slate-300 shrink-0 pb-1 transition"
          title="コピー"
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
          <label className="block text-sm font-bold mb-2 text-slate-300">好きな子のLINE（コピペしてください）</label>
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
                className="text-xs bg-pink-900/60 hover:bg-pink-800/80 border border-pink-700/50 hover:border-pink-500 text-pink-200 hover:text-white px-3 py-1.5 rounded-full transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <textarea
            className="w-full bg-pink-950/60 border border-pink-700/50 rounded-xl p-4 text-sm text-white placeholder-pink-400/50 resize-none focus:outline-none focus:border-pink-400 h-40"
            placeholder={"例）\n彼女: 「今日バイトだよー」\n自分: 「お疲れ！何時まで？」\n彼女: 「9時まで笑 なんで？」\n自分: 「いや別に笑」\n彼女: 「気になる笑」"}
            value={line}
            onChange={(e) => setLine(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-300">関係性・状況（任意）</label>
          <input
            type="text"
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
              <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
              <div className="text-3xl mb-3">⭐</div>
              <h2 className="text-lg font-bold mb-2">無料枠を使い切りました</h2>
              <p className="text-sm text-gray-500 mb-4">プレミアムプランで全機能を使えます</p>
              <KomojuButton
                planId="standard"
                planLabel="プレミアム ¥980/月を始める"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
              <button onClick={() => setShowPaywall(false)} className="text-xs text-gray-400 hover:text-gray-600 mt-3 block w-full">閉じる</button>
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
            {/* Xシェアボタン — 脈あり度スコア入り */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`【告白LINE返信AI】気になる人の脈あり度を診断したら${result.score}%でした💓\nAIが返信例文・告白タイミングまで教えてくれて神すぎる…\n#脈あり #LINE返信 #恋愛AI #告白\nhttps://kokuhaku-line-ai.vercel.app`)}`}
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
            <div className="flex overflow-x-auto border-b border-pink-800/50">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
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
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`「気になる人からのLINE、脈あり度${result.score}%って出た…${result.score >= 70 ? "これはいけるかも！？🔥" : result.score >= 40 ? "微妙なライン、どうしよう😅" : "厳しいか…でも諦めない💪"}」告白LINE返信AIで診断してみた → https://kokuhaku-line-ai.vercel.app #恋愛AI #脈あり #LINE返信`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-opacity">
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
                  {result.replies.map((r, i) => {
                    const labels = ["積極アプローチ", "自然な関係深め", "余韻残し"];
                    const labelColors = ["text-pink-400", "text-blue-400", "text-purple-400"];
                    const bgColors = ["bg-pink-500", "bg-blue-500", "bg-purple-500"];
                    // 本文と補足説明を分割（「なぜ効果的か」の説明部分を分ける）
                    const lines = r.split(/\n/);
                    const mainLine = lines[0] ?? r;
                    const subLines = lines.slice(1).join("\n").trim();
                    return (
                      <div key={i} className="flex flex-col gap-1">
                        <span className={`text-xs font-bold ml-1 ${labelColors[i] ?? "text-slate-400"}`}>
                          {i + 1}. {labels[i] ?? "返信例"}
                        </span>
                        {/* LINE吹き出し（右側・自分の送信） */}
                        <div className="flex justify-end items-end gap-2">
                          <button
                            onClick={() => copy(mainLine, `reply-${i}`)}
                            className="text-xs text-slate-500 hover:text-slate-300 shrink-0 pb-1 transition"
                            title="コピー"
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
                  <p className="text-xs text-slate-600 text-center pt-2">💬 送りたい文をコピーして、そのままLINEに貼り付けよう</p>
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
