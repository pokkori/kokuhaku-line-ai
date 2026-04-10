"use client";

import { useEffect, useRef, useState, memo } from "react";

interface AIResultCardProps {
  text: string;
  accentColor?: string;
  onComplete?: () => void;
  renderContent?: (text: string) => React.ReactNode;
  header?: React.ReactNode;
  minHeight?: string;
}

const AIResultCard = memo(function AIResultCard({
  text,
  accentColor = "#EC4899",
  onComplete,
  renderContent,
  header,
  minHeight = "120px",
}: AIResultCardProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);
  const prevTextRef = useRef("");

  useEffect(() => {
    if (text === prevTextRef.current) return;
    prevTextRef.current = text;
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!text) return;

    const CHUNK = 3;
    const DELAY = 18;
    intervalRef.current = setInterval(() => {
      indexRef.current = Math.min(indexRef.current + CHUNK, text.length);
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!);
        setDone(true);
        onComplete?.();
      }
    }, DELAY);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, onComplete]);

  const glowStyle = done
    ? {
        boxShadow: `0 0 24px ${accentColor}33, 0 0 48px ${accentColor}18`,
        borderColor: `${accentColor}55`,
      }
    : { borderColor: "rgba(236,72,153,0.15)" };

  return (
    <div
      className="relative rounded-2xl p-5 transition-all duration-700"
      style={{
        minHeight,
        background: "linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(139,92,246,0.05) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid",
        ...glowStyle,
      }}
    >
      {/* accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      {/* optional header */}
      {header && <div className="mb-3">{header}</div>}

      {/* typing cursor */}
      {!done && (
        <span
          className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
          style={{ background: accentColor, verticalAlign: "middle" }}
          aria-hidden="true"
        />
      )}

      {/* content */}
      <div className="leading-relaxed">
        {renderContent ? renderContent(displayed) : (
          <p className="text-sm text-pink-100 leading-relaxed whitespace-pre-wrap">{displayed}</p>
        )}
      </div>

      {/* done indicator */}
      {done && (
        <div
          className="absolute bottom-3 right-4 flex items-center gap-1 text-xs font-bold opacity-70"
          style={{ color: accentColor }}
          aria-label="生成完了"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          完了
        </div>
      )}
    </div>
  );
});

export default AIResultCard;
