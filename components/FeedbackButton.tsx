"use client";
export default function FeedbackButton() {
  return (
    <a href="https://twitter.com/levona_design" target="_blank" rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-pink-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg hover:bg-pink-700 transition-colors z-50"
      aria-label="フィードバックを送る">
      フィードバック
    </a>
  );
}
