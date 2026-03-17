"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import PayjpModal from "@/components/PayjpModal";

type Result = {
  score: number;
  analysis: string;
  replies: string[];
  confession: string;
  timing: string;
  adviceLine: string;
} | null;

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
  const color = score >= 70 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "脈ありです！" : score >= 40 ? "まだわからない" : "厳しいかも…";
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2 my-6">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 70 70)" strokeLinecap="round"
        />
        <text x="70" y="65" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">{score}%</text>
        <text x="70" y="85" textAnchor="middle" fill="#94a3b8" fontSize="11">脈あり度</text>
      </svg>
      <span className="font-bold text-lg" style={{ color }}>{label}</span>
    </div>
  );
}

type Tab = "score" | "analysis" | "replies" | "confession" | "timing";
const TABS: { id: Tab; label: string }[] = [
  { id: "score", label: "📊 判定" },
  { id: "analysis", label: "🔍 心理分析" },
  { id: "replies", label: "💬 返信例文" },
  { id: "confession", label: "💌 告白文" },
  { id: "timing", label: "📅 タイミング" },
];

export default function ToolPage() {
  const [line, setLine] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tab, setTab] = useState<Tab>("replies");
  const [copied, setCopied] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  useEffect(() => {
    fetch("/api/auth/status").then((r) => r.json()).then((d) => {
      setIsPremium(d.premium);
      setRemaining(d.remaining);
    });
  }, []);

  async function analyze() {
    if (!line.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setRawText("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line, context }),
      });
      if (res.status === 402) { setShowPaywall(true); setLoading(false); return; }
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
      setTab("replies");
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-blue-400">💬 恋愛コーチAI</Link>
        {!isPremium && remaining !== null && (
          <span className="text-xs text-slate-400">残り無料 {remaining}回</span>
        )}
        {isPremium && <span className="text-xs text-blue-400 font-bold">✓ プレミアム</span>}
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-300">好きな子のLINE（コピペしてください）</label>
          <textarea
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500 h-40"
            placeholder={"例）\n彼女: 「今日バイトだよー」\n自分: 「お疲れ！何時まで？」\n彼女: 「9時まで笑 なんで？」\n自分: 「いや別に笑」\n彼女: 「気になる笑」"}
            value={line}
            onChange={(e) => setLine(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-slate-300">関係性・状況（任意）</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            placeholder="例：クラスメートで知り合って1ヶ月、まだ連絡先交換したばかり"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        {!isPremium && remaining === 0 && !result && (
          <div className="bg-blue-900/40 border border-blue-600 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-200 mb-3">無料回数を使い切りました。月額¥980で無制限+高精度！</p>
            <button onClick={startCheckout} disabled={false} className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-2 rounded-xl text-sm transition disabled:opacity-50">
              プレミアムにアップグレード
            </button>
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading || !line.trim() || (!isPremium && remaining === 0)}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-4 rounded-xl text-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "AIが解析中…" : "解析する"}
        </button>

        {loading && rawText && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2 font-bold">生成中...</p>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{rawText}</p>
          </div>
        )}

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Paywall */}
        {showPaywall && (
          <div className="bg-pink-50 border-2 border-pink-400 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">今夜返信したいなら、今すぐ解除を</h2>
            <p className="text-gray-500 text-sm mb-6">
              返信が遅くなるほど相手の気持ちは冷めていきます。<br/>
              AIが最適な返信を今すぐ提案します。
            </p>
            <button onClick={startCheckout} disabled={false} className="bg-blue-500 hover:bg-blue-400 text-white font-black px-8 py-4 rounded-xl text-lg transition disabled:opacity-50 w-full">
              ¥980/月でアップグレード
            </button>
            <p className="text-slate-500 text-xs mt-4">
              ※ 恋愛・運命の相性を占いたい方は
              <a href="https://uranai-ai-sigma.vercel.app" className="text-pink-400 underline ml-1">占いAI</a>
              でも無料でお試しいただけます
            </p>
          </div>
        )}

        {result && (
          <div className="mt-8 flex flex-col gap-3">
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
          <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
            {/* Tab nav */}
            <div className="flex overflow-x-auto border-b border-slate-700">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition ${tab === t.id ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-500 hover:text-slate-300"}`}
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
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`【告白LINE返信AI】脈あり度 ${result.score}% 診断！あなたの気になる人は脈ありかも？ → https://kokuhaku-line-ai.vercel.app #恋愛AI #脈あり #LINE返信`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white font-bold py-3 rounded-xl text-sm transition-opacity">
                    脈あり{result.score}%をXでシェア 🔥
                  </a>
                </div>
              )}

              {tab === "analysis" && (
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{result.analysis}</div>
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
                    <button onClick={startCheckout} disabled={false} className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition disabled:opacity-50">
                      ¥980/月でアップグレード
                    </button>
                  </div>
                )
              )}

              {tab === "timing" && (
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{result.timing}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-600 space-x-4 mt-10">
        <Link href="/legal" className="hover:underline">特定商取引法</Link>
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
        <Link href="/" className="hover:underline">トップへ戻る</Link>
      </footer>
      {showPayjp && (
        <PayjpModal
          publicKey={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!}
          planLabel="プレミアムプラン ¥980/月 — LINE解析 無制限+高精度"
          onSuccess={() => { setShowPayjp(false); setIsPremium(true); }}
          onClose={() => setShowPayjp(false)}
        />
      )}
    </main>
  );
}
