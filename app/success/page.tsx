"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function Confetti() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ["#ec4899", "#f43f5e", "#a855f7", "#6366f1", "#3b82f6", "#eab308"];
    const ps = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 6,
    }));
    setParticles(ps);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

function SuccessContent() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="max-w-lg w-full mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-7xl mb-4">&#x1F496;</div>
          <h1 className="text-3xl font-black mb-2">プレミアム登録完了！</h1>
          <p className="text-blue-300">全機能が解放されました</p>
        </div>

        <div className="bg-blue-900/40 border border-blue-700 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-blue-300 mb-3 text-sm">あなたの特典</h2>
          <ul className="space-y-2 text-sm text-blue-100">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#10003;</span>
              LINE解析が無制限で使い放題
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#10003;</span>
              心理分析・脈あり判定の詳細レポート
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#10003;</span>
              告白文テンプレート自動生成（Premium限定）
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#10003;</span>
              最適な告白タイミング提案
            </li>
          </ul>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="font-bold text-blue-200 text-center text-sm">まずはこの3ステップ</h2>

          <Link href="/tool" className="flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-blue-400">1</div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">LINEのやり取りを解析する</p>
              <p className="text-xs text-blue-300/60">相手のメッセージを貼り付けてAI解析</p>
            </div>
            <span className="text-slate-500 group-hover:text-blue-400 transition-colors">&rarr;</span>
          </Link>

          <Link href="/tool" className="flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-blue-400">2</div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">返信例文を参考にする</p>
              <p className="text-xs text-blue-300/60">シチュエーション別の最適な返し方</p>
            </div>
            <span className="text-slate-500 group-hover:text-blue-400 transition-colors">&rarr;</span>
          </Link>

          <Link href="/tool" className="flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-blue-400">3</div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">告白文を生成する</p>
              <p className="text-xs text-blue-300/60">Premium限定：AIが最適な告白文を作成</p>
            </div>
            <span className="text-slate-500 group-hover:text-blue-400 transition-colors">&rarr;</span>
          </Link>
        </div>

        <div className="text-center bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-blue-300/60 mb-1">いつでもすぐアクセス</p>
          <p className="text-sm font-bold text-blue-200">このサイトをブックマークしておきましょう</p>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center py-12 px-4">
      <Suspense fallback={<p className="text-blue-400">読み込み中...</p>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
