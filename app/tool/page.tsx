"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Result = { score: number; analysis: string; replies: string[]; advice: string } | null;

function parseResult(text: string): Result {
  const get = (tag: string) => {
    const m = text.match(new RegExp(`===\\s*${tag}\\s*===\\s*([\\s\\S]*?)(?====|$)`));
    return m ? m[1].trim() : "";
  };
  const scoreStr = get("SCORE");
  const score = parseInt(scoreStr.match(/\d+/)?.[0] ?? "0", 10);
  const repliesRaw = get("REPLY");
  const replies = repliesRaw.split("---").map((r) => r.trim()).filter(Boolean);
  return { score, analysis: get("ANALYSIS"), replies, advice: get("ADVICE") };
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "text-pink-400" : score >= 40 ? "text-yellow-400" : "text-rose-400";
  const label = score >= 70 ? "脈あり💕" : score >= 40 ? "微妙…🤔" : "厳しいかも😢";
  return (
    <div className="flex flex-col items-center">
      <div className={`text-7xl font-black ${color}`}>{score}%</div>
      <div className={`text-xl font-bold mt-2 ${color}`}>{label}</div>
    </div>
  );
}

export default function ToolPage() {
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/status").then((r) => r.json()).then((d) => {
      setRemaining(d.remaining);
      setIsPremium(d.premium);
    });
  }, []);

  async function analyze() {
    if (!message.trim()) return;
    if (!isPremium && remaining === 0) { setShowPaywall(true); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      });
      const data = await res.json();
      if (res.status === 402) { setShowPaywall(true); return; }
      if (!res.ok) { setError(data.error ?? "エラーが発生しました"); return; }
      setResult(parseResult(data.result));
      setRemaining(data.remaining);
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  async function startCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setCheckoutLoading(false);
    }
  }

  function copy(text: string, i: number) {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen bg-rose-950 text-white">
      <header className="border-b border-rose-800 py-4 px-6 flex items-center justify-between">
        <Link href="/" className="text-pink-400 font-bold text-sm hover:text-pink-300">💌 脈あり解読AI</Link>
        <span className="text-rose-500 text-xs">
          {isPremium ? "✨ プレミアム" : remaining !== null ? `無料残り ${remaining}回` : ""}
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-center mb-2">LINEを解読する 💕</h1>
        <p className="text-rose-400 text-center text-sm mb-8">彼から来たLINEをそのまま貼り付けてください</p>

        <div className="space-y-4">
          <div>
            <label className="block text-rose-300 text-sm font-bold mb-2">
              💬 彼からのLINE（必須）
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder={"例：\n彼「今日暇？」\n私「暇だよ！何かあった？」\n彼「いや、なんとなく笑」\n彼「最近どうしてる」"}
              className="w-full bg-rose-900 border border-rose-700 rounded-xl p-4 text-white placeholder-rose-600 resize-none focus:outline-none focus:border-pink-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-rose-300 text-sm font-bold mb-2">
              📝 補足情報（任意）
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="例：同じクラスで2ヶ月前から話し始めた。昨日初めて2人で帰った。"
              className="w-full bg-rose-900 border border-rose-700 rounded-xl p-4 text-white placeholder-rose-600 focus:outline-none focus:border-pink-500 text-sm"
            />
          </div>

          <button
            onClick={analyze}
            disabled={loading || !message.trim()}
            className="w-full bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-white font-black text-lg py-4 rounded-xl transition"
          >
            {loading ? "AIが解読中…💭" : "💕 脈あり度を解読する"}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

        {result && (
          <div className="mt-10 space-y-6">
            {/* Score */}
            <div className="bg-rose-900 rounded-2xl p-8 text-center border border-rose-700">
              <div className="text-rose-400 text-sm font-bold mb-4">AIの判定結果</div>
              <ScoreRing score={result.score} />
            </div>

            {/* Analysis */}
            <div className="bg-rose-900 rounded-2xl p-6 border border-rose-700">
              <h2 className="text-pink-400 font-bold mb-3">🧠 彼の心理・気持ちの分析</h2>
              <p className="text-rose-200 text-sm leading-relaxed whitespace-pre-wrap">{result.analysis}</p>
            </div>

            {/* Reply suggestions */}
            <div className="bg-rose-900 rounded-2xl p-6 border border-rose-700">
              <h2 className="text-pink-400 font-bold mb-4">✉️ あなたへのおすすめ返信例文</h2>
              <div className="space-y-3">
                {result.replies.map((reply, i) => (
                  <div key={i} className="bg-rose-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-pink-300 text-xs font-bold">パターン {i + 1}</span>
                      <button
                        onClick={() => copy(reply, i)}
                        className="text-xs bg-rose-700 hover:bg-rose-600 px-3 py-1 rounded-lg transition"
                      >
                        {copied === i ? "✓ コピー済み" : "コピー"}
                      </button>
                    </div>
                    <p className="text-white text-sm whitespace-pre-wrap">{reply}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="bg-pink-900/40 rounded-2xl p-6 border border-pink-800">
              <h2 className="text-pink-400 font-bold mb-3">💡 恋愛アドバイス</h2>
              <p className="text-rose-200 text-sm leading-relaxed whitespace-pre-wrap">{result.advice}</p>
            </div>

            <button
              onClick={() => { setResult(null); setMessage(""); setContext(""); }}
              className="w-full border border-rose-700 text-rose-400 hover:text-white hover:border-rose-500 font-semibold py-3 rounded-xl transition text-sm"
            >
              別のLINEを解読する
            </button>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-rose-900 rounded-2xl p-8 max-w-md w-full text-center border border-pink-600">
            <div className="text-4xl mb-4">💌</div>
            <h2 className="text-xl font-black mb-2">無料の3回を使い切りました</h2>
            <p className="text-rose-300 text-sm mb-6">
              プレミアムプランで無制限に解読できます。<br />
              月¥980で毎日何度でも使い放題。
            </p>
            <button
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="w-full bg-pink-500 hover:bg-pink-400 text-white font-black py-4 rounded-xl transition disabled:opacity-60 mb-3"
            >
              {checkoutLoading ? "処理中..." : "¥980/月で続ける →"}
            </button>
            <button onClick={() => setShowPaywall(false)} className="text-rose-500 text-sm hover:text-rose-300">
              閉じる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
